// Uploads item and itemQuantity to user's cart. Called by item.js 
//Parameters: 'itemid' and 'quantity' (required)
const cloud = require('wx-server-sdk')

cloud.init({
  env : 'laotudata-laotu'
})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openID = wxContext.OPENID;
  
  //Upload the itemID and the quantity to the database
  //First get the cartProducts array
  let cartProductsResponse = await db.collection('userCart').where({
    _openid : openID
  }).get();
  //If the user record does not exist, initialize one
  if (cartProductsResponse.data.length < 1){
    //Could not a record for the user- create one with empty cartProducts array
    try{
      await db.collection('userCart').add({
      data : {
        _openid : openID,
        cartProducts : []
        }
      });
    }catch(e){
      throw new Error("Failed to initialize user record in the cart");
    }
    var cartProducts = [];
  }
  else{
    var cartProducts = cartProductsResponse.data[0].cartProducts;
  }

  //If there is an item object with the itemID already in cartProducts, simply increment the quantity
  let matchingItemObjectIndex = cartProducts.findIndex((itemObject) => itemObject.itemid === event.itemid)
  if (matchingItemObjectIndex === -1){
    //the itemID does not already exist in the cart
    //add itemObject to the cartProducts array
    let newItemObject = {itemid : event.itemid, quantity: event.quantity};
    cartProducts.push(newItemObject);
  }
  else{
    //item already exists in the array
    //increment the item quantity
    cartProducts[matchingItemObjectIndex].quantity += event.quantity;
  }

  //Update the cartProducts array in the database
  return await db.collection('userCart').where({_openid : openID}).limit(1)
    .update({
      data: {
        cartProducts : cartProducts
      },
      fail: function(err){
        console.error(err);
      }
    })
}