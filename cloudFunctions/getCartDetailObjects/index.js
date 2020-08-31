/**
 * Function is called in shopping cart. Uses the userCart productID array to build the array.
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
  //First we grab the array of productID's in the user's cart
  let cartResponse = await db.collection('userCart').where({
    _openid : openID
  }).get();
  let cartProducts = cartResponse.data[0].cartProducts;
  let productIDs = cartProducts.map(obj => obj.itemid);

  //For each id, we query the productObject from collection 'products'
  //Function takes in productId and returns a promise that contains the data
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