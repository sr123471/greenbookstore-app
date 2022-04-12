const cloud = require('wx-server-sdk');
const rp = require('request-promise');
cloud.init()

// 初始化首页信息，将获取学校、学院、专业、考试书籍种类写在一起
const getHomepageInitialData = async (event) => {
  const db = cloud.database();
  const data = {
    schoolList: [],
    currentSchoolData: {},
  }

  // 获取所有学校
  await db.collection('school')
    .aggregate()
    // 指定输出字段，1表示输出，0表示不输出，_id默认为1
    .project({
      schoolName: 1,
    })
    .end()
    .then(res => {
      res.list.forEach(item => {
        data.schoolList.push(item.schoolName)
      })
    })

  // 获取选中的学校信息
  await db.collection('school')
    .where({
      schoolName: event.schoolName
    })
    .get()
    .then(res => {
      data.currentSchoolData = res.data[0];
    })

  return data;
}

// 书籍列表展示，根据用户选择的是公共课、专业课或考试书籍来展示，分页展示
const getBookList = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  let data = {};
  let total = 0;

  let matchObj = {
    schoolName: event.schoolName,
  };
  if (event.bookType === 'publicBook') {
    matchObj = {
      ...matchObj,
      bookType: event.bookType,
      stock: _.gt(0),
    }
  } else if (event.bookType === 'majorBook') {
    matchObj = {
      ...matchObj,
      bookType: event.bookType,
      academy: event.academyName,
      major: event.detailType,
      stock: _.gt(0),
    }
  } else if (event.bookType === 'examBook') {
    matchObj = {
      ...matchObj,
      bookType: event.bookType,
      exam: event.detailType,
      stock: _.gt(0),
    }
  } else {
    matchObj = {
      ...matchObj,
      bookName: db.RegExp({
        regexp: event.bookName,
        options: 'i',
      }),
      stock: _.gt(0),
    }
  }

  // 获取符合记录的总数
  await db.collection('book')
    .aggregate()
    .match(matchObj)
    .count('total')
    .end()
    .then(res => {
      if (res.list.length !== 0)
        total = res.list[0].total
    })
  // 按排序方式分页返回
  if (event.sortType === 'synthesis') {
    await db.collection('book')
      .aggregate()
      .match(matchObj)
      .skip(event.offset)
      .limit(event.limit)
      .end()
      .then(res => {
        data = {
          data: res.list,
          total,
        };
      })
  } else {
    await db.collection('book')
      .aggregate()
      .match(matchObj)
      .sort({
        presentPrice: event.sortType === 'asc' ? 1 : -1,
        ISBN: 1,
      })
      .skip(event.offset)
      .limit(event.limit)
      .end()
      .then(res => {
        data = {
          data: res.list,
          total,
        };
      })
  }

  return data;
}

// 搜索图书
const searchBook = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  let data = [];
  await db.collection('book')
    .where({
      // 这个正则匹配的到中文下的小括号（），匹配不到英文下的小括号()，为啥？
      bookName: db.RegExp({
        regexp: event.value,
        options: 'i',
      }),
      stock: _.gt(0),
    })
    .limit(10)
    .get()
    .then(res => {
      console.log(res)
      data = res.data;
    })
  return data;
}

// 获取购物车列表
const getCartList = async (event) => {
  const db = cloud.database();
  let data = [];
  await db.collection('user')
    .where({
      open_id: event.userId
    })
    .get()
    .then(res => {
      data = res.data[0];
    })
  return data;
}

// 查找要添加的商品在购物车中是否已有
const hasBookInCart = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  let hasBookInCart = false;
  await db.collection('user')
    .where({
      open_id: event.userId,
      cartList: _.elemMatch({
        ISBN: _.eq(event.ISBN),
      })
    })
    .get()
    .then(res => {
      res.data.length !== 0 ? hasBookInCart = true : ''
    })
  return hasBookInCart;
}

// 将商品加入购物车
const addCart = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  await db.collection('user')
    .where({
      open_id: event.userId
    })
    .update({
      data: {
        cartList: _.push([event.book])
      }
    })
}

// 删除购物车中的一个或几个商品
const deleteCart = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  await db.collection('user')
    .where({
      open_id: event.userId
    })
    .update({
      data: {
        cartList: _.pull({
          ISBN: _.in(event.ISBNList)
        })
      }
    })
}


//获取订单信息
const getOrderList = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  let ret = [];
  let orderData = [];
  let book_id = [];
  let bookData = [];

  //查询订单
  await db.collection('order')
    .where({ open_id: event.open_id })
    .get()
    .then((res) => {
      orderData = res.data;
      orderData.forEach((item) => {
        book_id.push(item.book_id);
      })
    })

  //查询订单的书籍
  await db.collection('book')
    .where({ _id: _.in(book_id) })
    .get()
    .then((res) => {
      bookData = res.data;

      let map = new Map();

      for (let i = 0; i < bookData.length; i++) {
        map.set(bookData[i]._id, bookData[i]);
      }

      for (let i = 0; i < orderData.length; i++) {
        let obj = Object.assign({}, map.get(orderData[i].book_id), orderData[i])
        ret.push(obj);
      }
    })

  return ret;
}

const login = async (event) => {
  let rst=null;

  let options = {
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    qs: {
      appid: 'wxaf440938f8a30993',
      secret: 'b5e31f08f66706ed9c624a0bea95ca07',
      js_code: event.code,
      grant_type: 'authorization_code'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  console.log(options)

  await rp(options).then((res) => {
    rst=res.openid;
  })

  return rst
}

// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.action) {
    case 'login': {
      return login(event)
    }
    case 'getHomepageInitialData': {
      return getHomepageInitialData(event)
    }
    case 'getBookList': {
      return getBookList(event)
    }
    case 'searchBook': {
      return searchBook(event)
    }
    case 'getCartList': {
      return getCartList(event)
    }
    case 'hasBookInCart': {
      return hasBookInCart(event)
    }
    case 'addCart': {
      return addCart(event)
    }
    case 'deleteCart': {
      return deleteCart(event)
    }
    case 'getOrderList': {
      return getOrderList(event)
    }
    default: {
      return '云函数调用失败'
    }
  }
}
