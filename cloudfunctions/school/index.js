const cloud = require('wx-server-sdk')

cloud.init()

// 初始化首页信息，将获取学校、学院、专业、考试书籍种类写在一起
const getHomepageInitialData = async (event) => {
  const db = cloud.database();
  const data = {
    schoolData: [],
    academyData: {},
    examData: {},
  }

  // 获取学校
  await db.collection('school')
    .aggregate()
    // 指定输出字段，1表示输出，0表示不输出，_id默认为1
    .project({
      schoolName: 1,
    })
    .end()
    .then(res => {
      res.list.forEach(item => {
        data.schoolData.push(item.schoolName)
      })
    })

  // 获取学院
  await db.collection('school')
    .where({
      schoolName: event.schoolName
    })
    .field({
      publicBookList: 0,
    })
    .get()
    .then(res => {
      console.log(res)
      data.academyData = res.data[0];
    })

  // 获取专业
  await db.collection('major')
    .where({
      schoolName: event.schoolName
    })
    .field({
      majorBookList: 0,
      schoolName: 0,
    })
    .get()
    .then(res => {
      data.academyData.academyList.forEach(item => {
        res.data.forEach(i => {
          if (i.academyName === item.academyName)
            item.majorList ? item.majorList.push(i) : item.majorList = [i]
        })
      })
    })

  // 获取考试书籍种类
  await db.collection('exam')
    .where({
      schoolName: event.schoolName
    })
    .field({
      examBookList: 0,
    })
    .get()
    .then(res => {
      data.examData = res;
    })

  return data;
}

// 书籍列表展示，根据用户选择的是公共课、专业课或考试书籍来展示，分页展示
const getBookList = async (event) => {
  const db = cloud.database();
  const $ = db.command.aggregate;
  let data = [];
  if (event.bookType === 'publicBookList') {
    await db.collection('school')
      .aggregate()
      .match({
        schoolName: event.schoolName,
      })
      .project({
        _id: true,
        schoolName: true,
        publicBookList: $.slice(['$publicBookList', event.offset, event.limit]),
        total: $.size('$publicBookList'),
      })
      .end()
      .then(res => {
        data = res.list[0];
      })
  } else if (event.bookType === 'majorBookList') {
    await db.collection('major')
      .aggregate()
      .match({
        schoolName: event.schoolName,
        academyName: event.academyName,
        majorName: event.detailType,
      })
      .project({
        schoolName: true,
        academyName: true,
        majorName: true,
        majorBookList: $.slice(['$majorBookList', event.offset, event.limit]),
        total: $.size('$majorBookList'),
      })
      .end()
      .then(res => {
        console.log(res)
        data = res.list[0];
      })
  } else {
    await db.collection('exam')
      .aggregate()
      .match({
        schoolName: event.schoolName,
        examName: event.detailType,
      })
      .project({
        schoolName: true,
        examName: true,
        examBookList: $.slice(['$examBookList', event.offset, event.limit]),
        total: $.size('$examBookList'),
      })
      .end()
      .then(res => {
        data = res.list[0];
      })
  }
  return data;
}

// 根据销量、价格升序或降序来展示书籍
// const getBookListBySalesVolume = async (event) => {
//   const db = cloud.database();
//   await db.collection('school')
//     .aggregate()
//     .match({
//       schoolName: event.schoolName,
//     })
//     .project({
//       _id: true,
//       schoolName: true,
//       publicBookList: $.slice(['$publicBookList', event.offset, event.limit]),
//       total: $.size('$publicBookList'),
//     })
//     .end()
//     .then(res => {
//       data = res.list[0];
//     })
// }


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
  console.log(typeof event.ISBNList)
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

// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.action) {
    case 'getHomepageInitialData': {
      return getHomepageInitialData(event)
    }
    case 'getBookList': {
      return getBookList(event)
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
    default: {
      return '云函数调用失败'
    }
  }
}
