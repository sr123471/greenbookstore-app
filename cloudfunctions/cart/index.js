// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-3gvszt0af35408ad'
  // env: 'release-2gu9vjw481860c6a'
})

// 获取购物车列表
const getCartList = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  let data = [];
  let cartList = [];
  let ISBNList = [];
  await db.collection('user')
    .where({
      open_id: event.userId
    })
    .get()
    .then(res => {
      if (res.data.length !== 0) {
        cartList = res.data[0].cartList;
        ISBNList = res.data[0].cartList.map(item => item.ISBN);
      }
    })
  await db.collection('book')
    .where({
      ISBN: _.in(ISBNList)
    })
    .get()
    .then(res => {
      cartList.map(item => {
        res.data.map(i => {
          if (item.ISBN === i.ISBN) {
            data.push({
              ...item,
              ...i
            })
          }
        })
      })
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
        cartList: _.push({
          ISBN: event.book.ISBN,
          isSelect: false,
          selectQuantity: 1
        })
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

// 将购物车中的一个商品标记为选中或未选中
const selectOneItem = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  await db.collection('user')
    .where({
      open_id: event.openid,
      'cartList.ISBN': event.ISBN,
    })
    .update({
      data: {
        'cartList.$.isSelect': event.isSelect,
      }
    })
}

// 将购物车中的所以商品标记为选中或未选中
const selectAllItem = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  await db.collection('user')
    .where({
      open_id: event.openid,
    })
    .update({
      data: {
        'cartList.$[].isSelect': event.isSelect,
      }
    })
}

// 修改购物车中某个商品的selectQuantity的值
const alertSelectQuantity = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  await db.collection('user')
    .where({
      open_id: event.openid,
      'cartList.ISBN': event.ISBN,
    })
    .update({
      data: {
        'cartList.$.selectQuantity': event.selectQuantity,
      }
    })
}

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
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
    case 'selectOneItem': {
      return selectOneItem(event)
    }
    case 'selectAllItem': {
      return selectAllItem(event)
    }
    case 'alertSelectQuantity': {
      return alertSelectQuantity(event)
    }
    default: {
      return '云函数调用失败'
    }
  }
}
