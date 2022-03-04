// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化
cloud.init({
  env: 'cloud1-0g9mnrv48dfc20a1'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const data = db.collection('user').where({
    name: '沈荣'
  }).get().then(res => {
    console.log(res)
  })
  console.log(data)
  return {
    data,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}