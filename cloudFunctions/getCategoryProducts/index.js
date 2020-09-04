/**
 * Called by product.js and returns an object containing arrays of product objects corresponding to a category name.
 *    Note that in the category names there is 'All' and 'Featured' which returns all product objects
 *    and array of featured products under 'featured' respectively
 * Return : {'All' : [{}, {}],
 *            'someCategoryName'  : [{_id : str, title: str, ...},{}],
 *           'someCategoryName'  : [{}, {}],
 *            'Featured' : [{}, {}]
 *  } 
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
    var categoryResponse = await db.collection('productPageData').doc("theOnlyProductPageRecord").get();
  } catch(e){
    console.error("cloud getCategoryProducts() : failed to grab product page data record", e);
  }
  let categories = categoryResponse.data.categoryNames;
  //Check that categories is not empty
  if (categories.length < 1){
    return{
      statusCode : 404,
      errMsg : 'Category array is empty. Check cloud collection productPageData'
    }
  }
  //**First get an array of all products**//
  var productCollection = db.collection('products');
  const countResult = await productCollection.count();
  const total = countResult.total;
  //Calculate number of batch calls we need to make to get all records
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  //Push all promises to the array task
  const tasks = [];
  for (let i = 0; i < batchTimes; i++){
    const promise = productCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise);
  }
  //Wait for all promises to resolve and then accumulate the data using reduce
  let allProductsResp = (await Promise.all(tasks)).reduce(function(acc, curr){
    return {
      //for each read of MAX_LIMIT records, I am accumulating the read.data
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  });
  let allProducts = allProductsResp.data;
  
  //** For each category, I want to get the productObjects that are in that category **//
  var getProductsInCategory = function(categoryName){
    //If categoryName is 'All' simply return allProducts
    if (categoryName === 'All'){
      return allProducts;
    }
    else{
      //filter objects in allProducts that have the right category
      return allProducts.filter(productObj => productObj.categories.includes(categoryName)); 
    }
  };
  //Return an array that contains object with keys 'categoryName' and 'products'
  var dataArray = categories.map(function(category){
    return {categoryName : category, products : getProductsInCategory(category)}
  }); 
  
  return{
    data : dataArray,
    statusCode : 200
  }
  
}
