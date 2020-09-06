//Return: array of events objects for upcoming events
const cloud = require('wx-server-sdk')

cloud.init({
  env: "laotudata-laotu",
  traceUser: true
})
const db = cloud.database();
const _ = db.command;
const MAX_LIMIT = 100;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //Return all events that haven't passed already
  var collection = db.collection('events').where({
    expirationDateTime: _.gt(db.serverDate())
  });
  //Get every product from the collection and return as an array
  //Get the total number of records
  const countResult = await collection.count();
  const total = countResult.total;
  //If there are no events (total == 0), return empty array
  if (total === 0){
    return {
      events: []
    }
  }
  
  //Calculate number of batch calls we need to make to get all records
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  //Push all promises to the array task
  const tasks = [];
  for (let i = 0; i < batchTimes; i++){
    const promise = collection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise);
  }
  //Wait for all promises to resolve and then accumulate the data using reduce
  let events = (await Promise.all(tasks)).reduce(function(acc, curr){
    return {
      //for each read of MAX_LIMIT records, I am accumulating the read.data
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  });
  
  return {
    events: events
  }
}