/**
 * Return two arrays, upcomingData and pastData which determines which event has passed from the function call datetime.
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'laotudata-laotu',
  traceUser: true,
})
const db = cloud.database();
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //Get the total number of records
  const countResult = await db.collection('events').count();
  const total = countResult.total;
  console.log("total number of events is ", total);
  //Calculate number of batch calls we need to make to get all records
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  //Push all promises to the array task
  const tasks = [];
  for (let i = 0; i < batchTimes; i++){
    const promise = db.collection('events').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise);
  }
  //Wait for all promises to resolve and then accumulate the data using reduce
  let allEvents = (await Promise.all(tasks)).reduce(function(acc, curr){
    return {
      //for each read of MAX_LIMIT records, I am accumulating the read.data
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  return allEvents;
}