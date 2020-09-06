// Function will return the user's info record object
//Parameters: none
const cloud = require('wx-server-sdk')

cloud.init({env: 'laotudata-laotu'});
const db = cloud.database();
const _ = db.command;


exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openID = wxContext.OPENID;
  var userRecord = await db.collection('userInfo').where({
    _openid : openID
  }).get();
  //if userRecord does not exist, init one
  if (userRecord.data.length < 1){
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
      userRecord = await db.collection('userInfo').where({
        _openid : openID
      }).get();
    } catch{
      throw new Error("Failed to init userInfo");
    }
  }

  return {
    userInfo : userRecord.data
  }
}