// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init({
  env: 'test-3gvszt0af35408ad'
  // env: 'release-2gu9vjw481860c6a'
})

// 登陆验证并获取openid
const login = async (event) => {
  let openid = null;

  let options = {
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    qs: {
      appid: 'wx783aabee796d33ba',
      secret: '1ef46c330665567705e32a755b1616cb',
      js_code: event.code,
      grant_type: 'authorization_code'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  await rp(options).then((res) => {
    openid = res.openid;
  })

  // 先查询数据库中是否有该用户,若有则直接是登录态
  const db = cloud.database();
  let rst = await db.collection('user')
    .where({
      open_id: openid
    })
    .get()
    .then((res) => {
      if (res.data.length === 0) {
        return {
          isNewUser: true,
          openid
        }
      } else {
        return {
          isNewUser: false,
          openid,
          userInfo: res.data[0]
        }
      }
    })

  return rst
}

// 获取手机号并添加用户
const getPhoneNumber = async (event) => {
  const phoneMessage = await cloud.getOpenData({
    list: [event.cloudID]
  })
  const db = cloud.database();
  const _ = db.command;
  // 添加用户
  await db.collection('user')
    .add({
      data: {
        open_id: event.openid,
        name: event.name,
        phone: phoneMessage.list[0].data.phoneNumber,
        cartList: [],
      }
    })
  return phoneMessage
}

// 设置个人信息
const setUserInfo = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  let rst = await db.collection('user')
    .where({
      open_id: event.openid
    })
    .update({
      data: {
        name: event.name,
      }
    })
    .then(() => {
      return true;
    })

  return rst;
}

// 获取用户信息
const getUserInfo = async (event) => {
  const db = cloud.database();
  let rst = await db.collection('user')
    .where({
      open_id: event.openid
    })
    .get()
    .then((res) => {
      return res.data[0];
    })
  return rst;
}

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'login': {
      return login(event)
    }
    case 'getPhoneNumber': {
      return getPhoneNumber(event)
    }
    case 'setUserInfo': {
      return setUserInfo(event)
    }
    case 'getUserInfo': {
      return getUserInfo(event)
    }
    default: {
      return '云函数调用失败'
    }
  }
}
