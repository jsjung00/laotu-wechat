/**
 * Called by checkout.js when the user successfully makes a transaction
 * Adds an order object to the user's 'orders' array in 'userInfo'. Inits user record if does not exist in collection 'userInfo'
 * Parameters : 'newOrderObject'
 * newOrderObject = {
        streetName: str
        phoneNumber : number
        phoneCode : number
        name : str,
        regionCityDistrictArray : [regionstr, citystr, districtstr],
        totalPrice : number,
        cartQuantityObjects : [{itemid : str, quantity: Number, price : Number}, {}, {}...],
        cartDetailObjects : [{_id:String, title:String, ... like collection 'products'}],
        dateTime : currentDateTimeString}
   Return value: none.     
 */
const cloud = require('wx-server-sdk')
cloud.init({env : 'laotudata-laotu'});
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openID = wxContext.OPENID;
  //If the user doesn't have a record in userInfo, init one
  let response = await db.collection('userInfo').where({
    _openid : openID
  }).get();
  if (response.data.length < 1){
    //Could not find the user's record
    //Init a record
    try{
      await db.collection('userInfo').add({
        data: {
          _openid : openID,
          orders : [],
          shippingInfo : {}    
        }
      });
    } catch{
      throw new Error("Failed to init userInfo");
    }
  }
  //Add the shippingInfoObject to the user's record in 'userInfo' collection
  try{
    //Push the new object to the end of the user's 'orders' array
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