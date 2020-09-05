//DEPRECATED: DO NOT USE
// Takes in parameter 'category' which will be used to query from all products.
//If 'category' === 'All' return all products. 
//Return: array of product objects.
const cloud = require('wx-server-sdk')

cloud.init({
  env: "laotudata-laotu",
  traceUser: true
})
const db = cloud.database();
const _ = db.command;
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const category = event.category;
  //Throw error if developer forgot to add a category parameter
  if (!category){
    throw new Error("Forgot to add category parameter. Try again");
  }

  //For category 'All', need to return every product
  if (category === 'All'){
    var collection = db.collection('products');
  }
  else{
    //Query a specific category
    var collection = db.collection('products').where({
      category: _.eq(category)
    });
  }

  //Get every product from the collection and return as an array
  //Get the total number of records
  const countResult = await collection.count();
  const total = countResult.total;
  //If there are no products (total == 0), return empty array
  if (total === 0){
    return {
      products: []
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
  let products = (await Promise.all(tasks)).reduce(function(acc, curr){
    return {
      //for each read of MAX_LIMIT records, I am accumulating the read.data
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  });
  
  return {
    products: products
  }
}