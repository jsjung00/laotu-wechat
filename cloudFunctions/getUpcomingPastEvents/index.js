// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env : 'laotudata-laotu',
  traceUser : true
})
const db = cloud.database();
const MAX_LIMIT = 100;
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("function called");
  
  /*Get all upcoming Events as an array*/
  //Get the total number of records
  const upcomingCountResult = await db.collection('events').where({
    datetime: _.gt(db.serverDate())
  }).count();
  const upcomingTotal = upcomingCountResult.total;
  //Calculate number of batch calls we need to make to get all records
  const upcomingBatchTimes = Math.ceil(upcomingTotal / MAX_LIMIT);
  //Push all promises to the array task
  const upcomingTasks = [];
  for (let i = 0; i < upcomingBatchTimes; i++){
    const promise = db.collection('events').where({
      datetime: _.gt(db.serverDate())
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    upcomingTasks.push(promise);
  }
  //Wait for all promises to resolve and then accumulate the data using reduce
  let upcomingEventsResponse = (await Promise.all(upcomingTasks)).reduce(function(acc, curr){
    return {
      //for each read of MAX_LIMIT records, I am accumulating the read.data
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  });
  let upcomingEvents = upcomingEventsResponse.data;

  /*Get all past Events as an array*/
  //Get the total number of records
  const pastCountResult = await db.collection('events').where({
    datetime: _.lte(db.serverDate())
  }).count();
  const pastTotal = pastCountResult.total;
  //Calculate number of batch calls we need to make to get all records
  const pastBatchTimes = Math.ceil(pastTotal / MAX_LIMIT);
  //Push all promises to the array task
  const pastTasks = [];
  for (let i = 0; i < pastBatchTimes; i++){
    const promise = db.collection('events').where({
      datetime: _.lte(db.serverDate())
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    pastTasks.push(promise);
  }
  //Wait for all promises to resolve and then accumulate the data using reduce
  let pastEventsResponse = (await Promise.all(pastTasks)).reduce(function(acc, curr){
    return {
      //for each read of MAX_LIMIT records, I am accumulating the read.data
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  });
  let pastEvents = pastEventsResponse.data;

  /*Get the array of user's favEventIds*/
  //get the user's openID
  const wxContext = cloud.getWXContext()
  const openID = String(wxContext.OPENID);
  //index the user by their openId
  try{
    //attempt to access the user's record with their openID as _id
    let favEventsResponse = await db.collection('userFavEvents').doc(openID).get();
    var favEvents = favEventsResponse.data.favEvents;
  }
  catch{
    //user's favEvents DNE
    //initialize favEvents as []
    try{
      let _add = await db.collection('userFavEvents').add({
        data:{
          _id: openID,
          favEvents: []
        }
      });
      var favEvents = [];
    }
    catch(err){
      //failed to add faveventlist
      console.error(err);
      throw "failed to add faveventlist";
    }
  }
 

  /* given the user's favEventId's, append isFavorited: Boolean to every event object in upcomingEvents and pastEvents */
  var newUpcomingEvents = upcomingEvents.map(v => {
    //if eventID is in favEvents, add true boolean, add false boolean
    return v._id in favEvents ? Object.assign(v, {isFavorited : true}) : Object.assign(v, {isFavorited : false}) 
  });
  var newPastEvents = pastEvents.map(v => {
    //if eventID is in favEvents, add true boolean, add false boolean
    return v._id in favEvents ? Object.assign(v, {isFavorited : true}) : Object.assign(v, {isFavorited : false}) 
  });

  //return our tabs data array
  return{
    tabsData : [{
      title: "Upcoming",
      data: newUpcomingEvents
    },{
      title: "Past",
      data: newPastEvents
    }] 
  }
} 
