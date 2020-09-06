/**
 * Called by events.js and returns an array containing objects which include a category name and event objects
 *    corresponding to a category name.
 *    Note that in the category names there is 'All' which returns all product objects
 *    and array of featured products whose id exist in the 'featuredIDs' collection
 *  Return : [{categoryName :'All',
 *             events : [{}, {}]},
 *            {}, {}]
 *  ]
 */
const cloud = require('wx-server-sdk')

cloud.init({env : 'laotudata-laotu'});
const db = cloud.database();
const _ = db.command;
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  //Grab the array of categories
  try{
    var categoryResponse = await db.collection('eventPageData').doc("theOnlyEventPageRecord").get();
  } catch(e){
    console.error("cloud getCategoryEvents() : failed to grab event page data record", e);
  }
  let categories = categoryResponse.data.categoryNames;
  //Check that categories is not empty
  if (categories.length < 1){
    return{
      statusCode : 404,
      errMsg : 'Category array is empty. Check cloud collection eventPageData'
    }
  }
  //**First get an array of all upcoming events (those that have not expired) **//
  var collection = db.collection('events').where({
    expirationDateTime: _.gt(db.serverDate())
  });
  //**Get every event from the collection and return as an array**//
  //Get the total number of records
  const countResult = await collection.count();
  const total = countResult.total;
  //If there are no events, return an array of objects where the events value is always empty
  if (total === 0){
    var dataArray = categories.map(function(category){
      return {categoryName : category, events : []}
    });
    return{
      data : dataArray,
      statusCode : 200
    }
  }
  else{
    //There are events queried. Query all events in batches
    //Calculate number of batch calls we need to make to get all records
    const batchTimes = Math.ceil(total / MAX_LIMIT);
    //Push all promises to the array task
    const tasks = [];
    for (let i = 0; i < batchTimes; i++){
      const promise = collection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
      tasks.push(promise);
      console.log("I am making my" + i + "th query");
    }
    //Wait for all promises to resolve and then accumulate the data using reduce
    var _allEvents = (await Promise.all(tasks)).reduce(function(acc, curr){
      return {
        //for each read of MAX_LIMIT records, I am accumulating the read.data
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    });
    var allEvents = _allEvents.data;
  }
  console.log("allEvents", allEvents);
  
  //** Grab the array of featured event ID's from the collection 'featuredIDs' */
  let _featuredEventIDs = await db.collection('featuredIDs').get();
  let featuredEventIDs = _featuredEventIDs.data[0].eventIDs;
  console.log("my featured event IDS", featuredEventIDs);
  
  //** For each category, I want to get the eventObjects that are in that category **//
  var getEventsInCategory = function(categoryName){
    //If categoryName is 'All' simply return allEvents
    if (categoryName === 'All'){
      return allEvents;
    }
    //If categoryName is 'Featured', use the ID's from collection 'featuredIDs' and find event objects that
    //match the ID's
    //If featuredEventIDs is empty, returns an empty array
    else if (categoryName === 'Featured'){
      //Function find the feature event object based on its ID
      var findFeaturedEvent = function(featuredID){
        //Iterate through allEvents and return the first object that matches the featuredID
        for (let i = 0; i < allEvents.length; i++){
          if (allEvents[i]._id === featuredID){
            //Found the unique featured object, let's return
            return allEvents[i]
          }
          else{
            console.log("myID is" + featuredID + " and my object id is " + allEvents[i]._id);
            //Continue looping through array
          }
        }
        console.error("Could not find featured event ID in the events collection. Check the featured ID's");
      };
      return featuredEventIDs.map(featuredID => findFeaturedEvent(featuredID));
    }
    else{
      //filter objects in allEvents that have the right category
      //If none are found to be in the category, empty array is returned
      return allEvents.filter(function(eventObj){
        //Function should return true if the object categories includes the categoryName in its array
        let objCategories = eventObj.categories;
        if (objCategories == null){
          return false;
        }
        else if (objCategories.includes(categoryName)){
          return true;
        }
        else{
          return false;
        }
      }); 
    }
  };
  //Return an array that contains object with keys 'categoryName' and 'products'
  var dataArray = categories.map(function(category){
    return {categoryName : category, events : getEventsInCategory(category)}
  }); 
  
  return{
    data : dataArray,
    statusCode : 200
  }
  
}
