// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-3gvszt0af35408ad'
  // env: 'release-2gu9vjw481860c6a'
})

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
      .orderBy('createTime','desc')
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
      .orderBy('createTime','desc')
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

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getOrderList': {
      return getOrderList(event)
    }
    case 'getOrderCounts': {
      return getOrderCounts(event)
    }
    default: {
      return '云函数调用失败'
    }
  }
}
