/**
 * Called by favorites page. Returns an array that is tab data for the tabs swiper.
 *    return: tabs : [{title: "Events", data: [{_id: Str, title: Str, ...}]}, {title : "Products", data: []}]
 *    where the data is an array of events or product objects from the events or products collection
 * Parameters: none
 */

 
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'laotudata-laotu',
  traceUser: true
});

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const userID = wxContext.OPENID;
  
//Try to grab the user's favEvents if it exists. Collection 'userFavEvents' must have _openid: as a key
  let favEventsResponse = await db.collection('userFavEvents').where({
    _openid : userID
  }).get();
  if (favEventsResponse.data.length < 1){
    //User's record does not exist- init record
    try{
      db.collection('userFavEvents').add({
      data:{
        _openid : userID,
        favEvents : []
        }
      });
      var favEvents = [];
    }catch(e){
      throw new Error("Failed to initialize user record in userFavEvents collection", e);
    }
  }
  else{
    //User's record does exist
    var favEvents = favEventsResponse.data[0].favEvents;
    
  }
}

    /*let favEventsID = favEventsIDResponse.data.favEvents;

    //Query the events that have an eventID in favEventsID
    let favEventsResponse = await db.collection('events').where({
      "_id": _.in(favEventsID) 
    }).get()
    let favEvents = favEventsResponse.data; 
    return {
      favEvents
    }

    let favEventsResponse = await cloud.callFunction({
      name: 'getFavEvents',
      data: {
        userID : userID
      }
    });
    let favEvents = favEventsResponse.result.favEvents;
    
    //Create our tabData object
    var favTabData = [{
      title: "Events",
      data: favEvents
    },{
      title: "Items",
      data: []
    }];
    return{
      favTabData: favTabData
    }
  }
  catch(e){
    console.error(e);
  }
}*/