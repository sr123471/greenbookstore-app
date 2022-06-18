const cloud = require('wx-server-sdk');
cloud.init({
  env: 'test-3gvszt0af35408ad'
  // env: 'release-2gu9vjw481860c6a'
})

// 初始化首页信息，将获取学校、学院、专业、考试书籍种类写在一起
const getHomepageInitialData = async (event) => {
  const db = cloud.database();
  const data = {
    schoolList: [],
    academyList: [],
    majorList: [],
    examList: [],
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

  await db.collection('academy')
    .where({
      schoolName: event.schoolName
    })
    .get()
    .then(res => {
      data.academyList = res.data;
    })

  await db.collection('major')
    .where({
      schoolName: event.schoolName
    })
    .get()
    .then(res => {
      data.majorList = res.data;
    })

  await db.collection('exam')
    .where({
      schoolName: event.schoolName
    })
    .get()
    .then(res => {
      data.examList = res.data;
    })

  return data;
}

// 书籍列表展示，根据用户选择的是公共课、专业课或考试书籍来展示，分页展示
const getBookList = async (event) => {
  console.log(event)
  const db = cloud.database();
  const _ = db.command;
  let data = {};
  let total = 0;

  let matchObj = {
    schoolName: event.schoolName,
  };
  if (event.bookType === 'publicBook' || event.bookType === 'novelBook') {
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
    // 搜索框搜索场景
    matchObj = _.or([{
        ...matchObj,
        ISBN: event.bookName,
        stock: _.gt(0),
      },
      {
        ...matchObj,
        bookName: db.RegExp({
          regexp: event.bookName,
          options: 'i',
        }),
        stock: _.gt(0),
      },
      {
        ...matchObj,
        author: db.RegExp({
          regexp: event.bookName,
          options: 'i',
        }),
        stock: _.gt(0),
      },
    ])
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
    // 多字段匹配
    .where(_.or([{
        ISBN: event.value,
        stock: _.gt(0),
      },
      {
        // 这个正则匹配的到中文下的小括号（），匹配不到英文下的小括号()，为啥？
        bookName: db.RegExp({
          regexp: event.value,
          options: 'i',
        }),
        stock: _.gt(0),
      },
      {
        author: db.RegExp({
          regexp: event.value,
          options: 'i',
        }),
        stock: _.gt(0),
      },
    ]))
    .limit(10)
    .get()
    .then(res => {
      data = res.data;
    })
  return data;
}

// 获取订单数目
const getOrderCounts = async (event) => {
  const db = cloud.database();
  const _ = db.command;

  console.log(event)

  if (event.status === 'allorder') {
    let count = await db.collection('order')
      .where({
        open_id: event.open_id,
      })
      .count();
    console.log(count)
    return count;
  } else {
    let count = await db.collection('order')
      .where({
        open_id: event.open_id,
        status: event.status
      })
      .count();
    console.log(count)
    return count;
  }

}

// 获取订单信息
const getOrderList = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  let ret = [];
  let orderData = [];
  let ISBN = [];
  let bookData = [];

  //查询订单

  if (event.status === 'allorder') {
    await db.collection('order')
      .where({
        open_id: event.open_id
      })
      .limit(event.limit)
      .skip(event.skip)
      .get()
      .then((res) => {
        orderData = res.data;
        orderData.forEach((item) => {
          ISBN.push(item.ISBN);
        })
      })
  } else {
    console.log(1)
    await db.collection('order')
      .where({
        open_id: event.open_id,
        status: event.status
      })
      .limit(event.limit)
      .skip(event.skip)
      .get()
      .then((res) => {
        orderData = res.data;
        orderData.forEach((item) => {
          ISBN.push(item.ISBN);
        })
      })
  }

  //查询订单的书籍
  await db.collection('book')
    .where({
      _id: _.in(ISBN)
    })
    .get()
    .then((res) => {
      bookData = res.data;

      let map = new Map();

      for (let i = 0; i < bookData.length; i++) {
        map.set(bookData[i]._id, bookData[i]);
      }

      for (let i = 0; i < orderData.length; i++) {
        let obj = Object.assign({}, map.get(orderData[i].ISBN), orderData[i])
        ret.push(obj);
      }
    })

  return ret;
}

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

const pay = async (event) => {
  const res = await cloud.cloudPay.unifiedOrder({
    body: '测试支付',

  })
}


// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.action) {
    case 'getHomepageInitialData': {
      return getHomepageInitialData(event)
    }
    case 'getBookList': {
      return getBookList(event)
    }
    case 'searchBook': {
      return searchBook(event)
    }
    case 'getOrderList': {
      return getOrderList(event)
    }
    case 'getOrderCounts': {
      return getOrderCounts(event)
    }
    case 'addAdvice': {
      return addAdvice(event)
    }
    case 'pay': {
      return pay(event)
    }
    default: {
      return '云函数调用失败'
    }
  }
}
