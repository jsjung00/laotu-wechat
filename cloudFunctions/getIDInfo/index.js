// Returns the user's ID
const cloud = require('wx-server-sdk')

cloud.init({
  env: "laotudata-laotu"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}