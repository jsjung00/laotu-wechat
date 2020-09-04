// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env : 'laotudata-laotu'});

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
   "errcode": 0,
   "errmsg" : "some message"
  }
}