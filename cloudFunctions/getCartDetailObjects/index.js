/**
 * Called by shoppingcart.js. Uses the userCart productID array to extract an array of item ID's
 *    and for each ID, it creates an cartDetailObject which is the object in the collection 'products'
 * Parameters : None
 * Return : Array containing the cartDetailObjects [{_id:"", titleStr: "",...}] which is from collection 'products' 
 */

//Return: 
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'laotudata-laotu'
});

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openID = wxContext.OPENID;
  //**First we grab the array of productID's in the user's cart by getting user's cart info from 'userCart'**//
  let cartResponse = await db.collection('userCart').where({
    _openid : openID
  }).get();

  //If the user record does not exist, initialize one
  if (cartResponse.data.length < 1){
    //Could not get a record for the user- create one with empty cartProducts array
    console.log("getCartDetailObjects(): user has no record");
    try{
      await db.collection('userCart').add({
      data : {
        _openid : openID,
        cartProducts : [],
        msg : "from getCartDetailObjects"
        }
      });
    }catch(e){
      throw new Error("Failed to initialize user record in the cart");
    }
    var cartProducts = [];
    //Since there are no products, there are no product IDs and will return an empty array
    return {
      cartDetailObjects : []
    }
  }
  else{
    var cartProducts = cartResponse.data[0].cartProducts;
    //If cartProducts is empty, reutrn an empty array
    if (cartProducts.length < 1){
      console.log("cartProducts is empty. returning empty array");
      return{
        cartDetailObjects : []
      }
    }

    //Using the cartProducts array, we take the itemid from each productObject
    var productIDs = cartProducts.map(obj => obj.itemid);
  }
  
  //For each id, we query the productObject from collection 'products'
  //Function takes in productID and returns a promise that contains the data
  var getProductObject = async function(productID){
    let objectResponse = await db.collection('products').doc(productID).get();
    let objectData = objectResponse.data;
    return objectData;
  }

  //Get an array of promises that contain the values that I want (the product details objects)
  var productObjectPromises = productIDs.map(id => getProductObject(id));
  //Get the product details objects
  let cartDetailObjects = await Promise.all(productObjectPromises);
  return {
    cartDetailObjects : cartDetailObjects
  }

}