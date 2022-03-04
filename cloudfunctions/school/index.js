const cloud = require('wx-server-sdk')

cloud.init()

// 获取学校

// 获取学院和专业

// 获取某一学校的公共课书籍

// 获取某一学校的专业课书籍

// 获取某一学校的考试书籍

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const data = db.collection('school').where({
    name: '沈荣'
  }).get().then(res => {
    console.log(res)
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}