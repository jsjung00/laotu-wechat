/**
 * Adds an order object to the user's 'orders' array in 'userInfo'. Inits user record if does not exist in collection 'userInfo'
 * Parameters : 'newOrderObject'
 * newOrderObject = {
        streetName: str
        phoneNumber : number
        phoneCode : number
        name : str,
        regionCityDistrictArray : [regionstr, citystr, districtstr],
        totalPrice : number,
        cartQuantityObjects : [{itemid : str, quantity: Number, price : Number}, {}, {}...]}
   Return value: none.     
 */
const cloud = require('wx-server-sdk')
cloud.init({env : 'laotudata-laotu'});
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openID = wxContext.OPENID;
  try{
    //push the new object to the end of the user's 'orders' array
    await db.collection('userInfo').where({
      _openid : openID
    }).update({
      data : {
        orders : _.push(event.newOrderObject)
      }
    });
  } catch{
    return {
      response : "Failed to update user's orders array"
    }
  }
  return {
    response : "Successful update to orders array"
  }
}