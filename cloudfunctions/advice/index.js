// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-3gvszt0af35408ad'
  // env: 'release-2gu9vjw481860c6a'
})

const addAdvice = async (event) => {
  const db = cloud.database();
  const _ = db.command;

  let now = db.serverDate();
  let nowTime = new Date().getTime()
  let yesterday = new Date(nowTime - 86400000);

  let hasSent = await db.collection('advice')
    .where({
      openid: event.openid,
      timeStamp: _.gte(yesterday)
    })
    .get()
    .then((res) => {
      return res.data.length;
    })

  if (hasSent === 1) {
    return false;
  }

  await db.collection('advice')
    .add({
      data: {
        openid: event.openid,
        brief: event.brief,
        detail: event.detail,
        timeStamp: now,
      }
    })
}


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'addAdvice': {
      return addAdvice(event)
    }
    default: {
      return '云函数调用失败'
    }
  }
}
