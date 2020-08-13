// create and return the tab data for the Favorites Page
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
  
  //Get the fav events
  try{
    //Pass in userID as a parameter since funky stuff happens with getWXContext
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
}