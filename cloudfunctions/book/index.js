// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-3gvszt0af35408ad'
  // env: 'release-2gu9vjw481860c6a'
})

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

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getBookList': {
      return getBookList(event)
    }
    case 'searchBook': {
      return searchBook(event)
    }
    default: {
      return '云函数调用失败'
    }
  }
}
