// 云函数入口文件
const cloud = require('wx-server-sdk')
const sub_mch_id = require('./key.json').sub_mch_id


cloud.init({
  env: 'test-3gvszt0af35408ad'
  // env: 'release-2gu9vjw481860c6a'
})

const db = cloud.database();
const _ = db.command;


const uuid = function () {
  let $chars = '0123456789';
  let maxPos = $chars.length;
  let pwd = '';
  for (i = 0; i < 32; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  console.log(pwd)
  return pwd;
}

const generateNstr = function () {
  let $chars = 'QWERTYUIOPASDFGHJKLZXCVBNM1234567890';
  let maxPos = $chars.length;
  let pwd = '';
  for (i = 0; i < 32; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  console.log(pwd)
  return pwd;
}

const addOrderDelCart = async (book, openid, remark) => {
  let user = await db.collection('user').where({
    open_id: openid
  }).get()

  user = user.data[0]
  console.log(user)


  let totalPrice = 0
  for (let i = 0; i < book.length; i++) {
    item = book[i]
    totalPrice += item.num * item.presentPrice
  }
  totalPrice = Math.round(totalPrice * 100) / 100
  console.log("haha"+remark)
  console.log(totalPrice)
  await db.collection('order').add({
    data: {
      book: book,
      createTime: new Date().getTime(),
      name: user.name,
      phone: user.phone,
      remark: remark,
      open_id: openid,
      receiveTime: 0,
      price: totalPrice,
      status: 'unReceived',
      imgURL: book[0].imgURL
    }
  })

  cart = user.cartList
  console.log(cart)
  // console.log(book)

  for (let i = 0; i < cart.length; i++) {
    for (let j = 0; j < book.length; j++) {
      item = book[j]

      if (item.ISBN === cart[i].ISBN) {
        cart.splice(i, 1)
        i--
        break
      }
    }
  }

  console.log(cart)

  await db.collection('user')
    .where({
      open_id: openid
    })
    .update({
      data: {
        cartList: cart
      }
    })
}

const verifyStock = async (book) => {
  // console.log(book)
  for (let i = 0; i < book.length; i++) {
    item = book[i]
    let stk = await db.collection('book').where({
      ISBN: item.ISBN
    }).get()
    // console.log(stk.data[0])
    stk = stk.data[0].stock
    console.log(stk, item.num);

    if (stk + item.num < item.num) {
      return -1
    }
  }
  return 1
}

const delStock = async (book) => {
  console.log(book)
  for (let i = 0; i < book.length; i++) {
    item = book[i]
    let stk = await db.collection('book').where({
      ISBN: item.ISBN
    }).get()
    let sv = stk.data[0].salesVolume
    stk = stk.data[0].stock
    console.log(item)

    await db.collection('book')
      .where({
        ISBN: item.ISBN
      })
      .update({
        data: {
          stock: stk - item.num,
          salesVolume: sv + item.num
        }
      })
  }
}

const addStock = async (book) => {

  for (let i = 0; i < book.length; i++) {
    item = book[i]
    let stk = await db.collection('book').where({
      ISBN: item.ISBN
    }).get()
    let sv = stk.data[0].salesVolume
    stk = stk.data[0].stock

    await db.collection('book')
      .where({
        ISBN: item.ISBN
      })
      .update({
        data: {
          stock: stk + item.num,
          salesVolume: sv - item.num
        }
      })
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  // const result = (await db.collection('pay').doc(event.userInfo.openId).get()).data;
  // if(result.uuid!=null){
  // 	let order = (await db.collection('pay_order').doc(result.uuid).get()).data;
  // 	return {
  // 		code: 0,
  // 		uuid:result.uuid,
  // 		pay: order.payment
  // 	}
  // }
  console.log(event.remark)

  if (event.type === 'done') {
    addOrderDelCart(event.book, event.openid, event.remark)
    return true;
  }

  else if (event.type === 'stock') {
    let rst = await verifyStock(event.book)
    return rst
  }

  else if (event.type == 'revert') {
    addStock(event.book)
  }

  else {
    const uid = uuid();
    const nstr = generateNstr();

    const totalPrice = Math.round(event.total * 100)
    console.log(totalPrice)

    data = {
      body: "测试微信支付功能",
      outTradeNo: uid,
      spbillCreateIp: '127.0.0.1',
      subMchId: sub_mch_id,
      totalFee: totalPrice,
      envId: "release-2gu9vjw481860c6a",
      functionName: "done_pay",
      tradeType: 'JSAPI',
      nonceStr: nstr
    }
    // console.log(data)
    const res = await cloud.cloudPay.unifiedOrder(data)

    delStock(event.book)

    // console.log(res)

    // if (res.returnCode === 'SUCCESS') {
    // 	addOrderDelCart(event.book)
    // 	// changeStock(event.book)
    // }
    return res
  }
}
