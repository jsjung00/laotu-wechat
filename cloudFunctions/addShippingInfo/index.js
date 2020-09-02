// Called from editShippingInfo page. Parameters: 'name','streetName','regionCityDistrictArray','phoneCode','phoneNumber'
// Updates the user's shippinginfo object using the parameters - inits user record if does not exist.
//  Note that the shipping info object keys are exactly 'name', 'streetName', ect...
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'laotudata-laotu'
})
const db = cloud.database();
const _ = db.command;


exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openID = wxContext.OPENID;
  //If userInfo object does not exist, create one
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
  
  //Update the user's shippingInfoObject
  let name = event.name;
  let streetName = event.streetName;
  let regionCityDistrictArray = event.regionCityDistrictArray;
  let phoneCode = event.phoneCode;
  let phoneNumber = event.phoneNumber;
  //Check for validity
  if (name.length < 1 || streetName.length < 1 || phoneNumber.length < 1){
    throw new Error("editShippingInfo page passed in incorrect/invalid info.");
  }
  try{
    await db.collection('userInfo').where({
      _openid : openID
    }).update({
      data: {
        shippingInfo : {name : name, 
          streetName : streetName,
          regionCityDistrictArray : regionCityDistrictArray,
          phoneCode : phoneCode,
          phoneNumber : phoneNumber
          }
      }
    });
  }catch{
    throw new Error("Failed to update shipping info");
  }

  return {
    success : "Shipping info update successful"
  }
}