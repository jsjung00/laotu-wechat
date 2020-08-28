// Function returns an array that contains user's cartProducts
const cloud = require('wx-server-sdk')

cloud.init({
  env : 'laotudata-laotu'
});

const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openID = wxContext.OPENID;
  //Get the user's cart

  let cartResponse = await db.collection('userCart').where({
    _openid : openID
  }).get();
  let cartProducts = cartResponse.data[0].cartProducts;
  return {
    cartProducts : cartProducts
  }
}