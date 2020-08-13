/**
 * takes in parameter id which is the eventID of the favorited event
 * adds or removes the eventID from the user's list of favEvents
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'laotudata-laotu',
  traceUser: true
})
const db = cloud.database();
const MAX_LIMIT = 100;
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.id);
  const wxContext = cloud.getWXContext()
  const userID = wxContext.OPENID;
  /*get the user's favList*/
  let favEventsResponse = await db.collection('userFavEvents').doc(userID).get();
  let favEvents = favEventsResponse.data.favEvents;

  //Add event ID if does not exist in favEvents; else, remove event
  if (favEvents.includes(String(event.id))){
    //event already exists- remove from list
    const eventIndex = favEvents.indexOf(String(event.id));
    favEvents.splice(eventIndex, 1);
    //update cloud favEvents
    try{
      return await db.collection('userFavEvents').doc(userID).update({
        data:{
          favEvents: favEvents
        }  
      })
    }
    catch(e){
      console.error(e);
    }
  }
  else{
    //event doesn't exist, add to list
    try{
      return await db.collection('userFavEvents').doc(userID).update({
        data: {
          //add the eventID to the end of the list
          favEvents: _.push([event.id])
        }
      })
    }
    catch(e){
      console.error(e);
    }
  }
}