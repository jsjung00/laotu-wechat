/** Called in shoppingcart.js and item.js
 * Returns an array of objects that represent the user's cart. The objects are in the form
 *    {itemid: String, quantity: Number}
 * Parameters: none
 * 
 * If the user's record does not exist, we init the record with an empty cartProducts array
 *  */ 

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
  //If the user record does not exist, initialize one
  if (cartResponse.data.length < 1){
    console.log("User Record DNE!");
    //Could not a record for the user- create one with empty cartProducts array
    try{
      await db.collection('userCart').add({
      data : {
        _openid : openID,
        cartProducts : [],
        message: "Why did this get created?"
        }
      });
    }catch(e){
      throw new Error("Failed to initialize user record in the cart");
    }
    var cartProducts = [];
  }
  else{
    var cartProducts = cartResponse.data[0].cartProducts;
  }

  return {
    cartProducts : cartProducts
  }
}