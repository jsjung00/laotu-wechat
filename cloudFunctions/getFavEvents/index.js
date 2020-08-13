// Function returns the favorited events objects using the user's favorite events ID list.
//No required parameters, optional userID parameter

const cloud = require('wx-server-sdk')

cloud.init({
  env: "laotudata-laotu",
  traceUser: true
})

const db = cloud.database();
const _  = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var userID = wxContext.OPENID;
  //We will use the openID parameter if the userID is null
  if (!userID){
    userID = event.userID;
  }
  
  //Get the user's fav events ID list 
  let favEventsIDResponse = await db.collection('userFavEvents').doc(userID).get();
  let favEventsID = favEventsIDResponse.data.favEvents;

  //Query the events that have an eventID in favEventsID
  let favEventsResponse = await db.collection('events').where({
    "_id": _.in(favEventsID) 
  }).get()
  let favEvents = favEventsResponse.data; 
  return {
    favEvents
  }
}