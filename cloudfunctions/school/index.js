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

// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.action) {
    case 'getHomepageInitialData': {
      return getHomepageInitialData(event)
    }
    default: {
      return '云函数调用失败'
    }
  }
}
