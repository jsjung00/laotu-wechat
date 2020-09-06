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
  //**Build the array of user fav event objects **//
  //Try to grab the user's favEvents (list of ID's) if it exists. Collection 'userFavEvents' must have _openid: as a key
  let favEventsResponse = await db.collection('userFavEvents').where({
    _openid : userID
  }).get();
  if (favEventsResponse.data.length < 1){
    //User's record does not exist- init record
    try {
      db.collection('userFavEvents').add({
      data:{
        _openid : userID,
        favEvents : []
        }
      });
      var favEventIDs = [];
    } catch (error) {
      throw new Error("Failed to initialize user record in userFavEvents collection");
    }
  }
  else{
    //User's record does exist
    var favEventIDs = favEventsResponse.data[0].favEvents; 
  }

  //Query the events that have an eventID in favEventsID
  let _favEvents = await db.collection('events').where({
    "_id": _.in(favEventIDs) 
  }).get()
  
  console.log("_favevents", _favEvents);
  let favEvents = _favEvents.data; 

  //**Grab the array of fav product objects *//
  //Try to grab the user's favEvents (list of ID's) if it exists. Collection 'userFavEvents' must have _openid: as a key
  let favProductsResponse = await db.collection('userFavProducts').where({
    _openid : userID
  }).get();

  if (favProductsResponse.data.length < 1){
    //User's record does not exist- init record
    try {
      db.collection('userFavProducts').add({
      data:{
        _openid : userID,
        favProducts : []
        }
      });
      var favProductIDs = [];
    } catch (error) {
      throw new Error("Failed to initialize user record in userFavEvents collection");
    }
  }
  else{
    //User's record does exist
    var favProductIDs = favProductsResponse.data[0].favProducts; 
  }
  console.log("favProductIDs", favProductIDs);

  //Query the product objects that have an ID in favProductIDs
  let _favProducts = await db.collection('products').where({
    "_id": _.in(favProductIDs) 
  }).get()
  
  let favProducts = _favProducts.data; 
  console.log("favProducts", favProducts);
  
  //Create our tabData object
  var favTabData = [{
    title: "Events",
    data: favEvents
  },{
    title: "Products",
    data: favProducts
  }];

  return{
    favTabData: favTabData
  }
}