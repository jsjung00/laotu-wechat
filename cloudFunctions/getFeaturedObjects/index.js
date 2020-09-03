/**
 * Called by home page. Returns an object that contains the array of product Objects (from collection 'products')
 *    and array of event objects
 * Parameters: none
 * Returns: {productObjects : [{_id : str, price : Number, ...}, {}], eventObjects : [{_id : str, title : str, ..}]}
 */
const cloud = require('wx-server-sdk')

cloud.init({env : 'laotudata-laotu'});
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openID = wxContext.OPENID;
  //Grab the array of featuredProductIDs and featuredEventIds from collection 'featuredIDs'
  try{
    var res = await db.collection('featuredIDs').limit(1).get();
  } catch (e){
    throw new Error("getFeaturedObjects :failed to get record from featuredIDs");
  }
  console.log(res);
  let featuredIDsObject = res.data[0];
  let productIDs = featuredIDsObject.productIDs;
  let eventIDs = featuredIDsObject.eventIDs;
  //For each id, get the corresponding object from the 'products' or 'events' collection
  //Parameter: id and 'product' or 'event'
  var getObject = async function(id, type){
    if (type === 'product'){
      var res = await db.collection('products').doc(id).get();
      return res;
    }
    else if (type === 'event'){
      var res = await db.collection('events').doc(id).get();
      return res;
    } else{
      throw new Error("In getObject from getFeaturedObjects: put in wrong parameter");
    }
  }
  var productObjectsPromise = productIDs.map(async function(id){
    let response = await getObject(id, 'product');
    return response.data;
  });
  var eventObjectsPromise = eventIDs.map(async function(id){
    let response = await getObject(id, 'event');
    return response.data;
  });
  var productObjects = await Promise.all(productObjectsPromise);
  var eventObjects = await Promise.all(eventObjectsPromise);

  return{
    productObjects : productObjects,
    eventObjects : eventObjects
  }
}