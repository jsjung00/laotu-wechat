/**
 * Page displays the user's orders.
 * Query the user's order by calling cloud function 'getUserInfo' and get the user's orders array
 *    which contains the price, quantity that the user bought and the productDetailObject (like from collection 'products')
 *    example object: newOrderObject = {
        streetName: str
        phoneNumber : number
        phoneCode : number
        name : str,
        regionCityDistrictArray : [regionstr, citystr, districtstr],
        totalPrice : number,
        cartQuantityObjects : [{itemid : str, quantity: Number, price : Number}, {}, {}...],
        cartDetailObjects : [{_id:String, title:String, ... like collection 'products'}],
        dateTime : currentDateTimeString}
 * In order to display the various productCards, page will create an allOrderObjects array that contains objects of the following form
 *    {price: Number, title:String, quantity:Number, thumbUrl:String, dateTimeStr : String}  
 */
var app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    //allOrderObjects : Array that is passed to the page in order to render the cards
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    var that = this;
    this.setOrderObjects();     

  },
  setOrderObjects : async function(){
    //Grab the user's cart info by calling cloud function getUserInfo
    let userInfoResp = await wx.cloud.callFunction({
      name: 'getUserInfo'
    });
    let userInfo = userInfoResp.result.userInfo[0];
    let shippingInfo = userInfo.shippingInfo;
    let orders = userInfo.orders;
    console.log("orders", orders);
    //Note: if orders is empty, upload an empty orderObjects array
    if (orders.length < 1){
      that.setData({allOrderObjects : []})
      return;
    }
    else{
      //Construct our orderObjects array
      
      //Helper function for createOrderObjecsFromOrder- given an itemID, will return an {title: String, thumbUrl: String}
      //NOTE: every item from cartQuantityObject maps to a unique cartDetailObject
      var getTitleUrlPrice = function(itemID, cartDetailObjects){
        //Get the matching cartDetailObject
        let detailObject = cartDetailObjects.find(obj => obj._id === itemID);
        let title = detailObject.title;
        let thumbUrl = detailObject.thumbUrl;
        let price = detailObject.price;
        let descSummary = detailObject.descSummary;
        console.log("title", title, "thumbUrl", thumbUrl, "price", price);
        return {title: title, thumbUrl : thumbUrl, price: price, descSummary : descSummary}
      }

      //Function takes in an order and creates an array of order objects for that particular order
      var createOrderObjectsFromOrder = function(order){
        let cartQuantityObjects = order.cartQuantityObjects;
        let cartDetailObjects = order.cartDetailObjects;
        let dateTimeStr = order.dateTimeStr;
        //For each cartQuantityObject, use the itemID to find the corresponding cartDetailObject and add
        //the title and thumbUrl. We also add the dateTimeStr
        var orderObjects = cartQuantityObjects.map(function(quantObj){
          let itemID = quantObj.itemid;
          //See helper function doc above
          let titleUrlPrice = getTitleUrlPrice(itemID, cartDetailObjects);
          //Now we create our object by taking the quantObj and adding title, thumbUrl, and price key values 
          return {...quantObj, ...titleUrlPrice}
        });
        console.log("orderObjects", orderObjects);
        return orderObjects;
      }
      //Iterate through each order and append to allOrderObjects to create the array of all objects
      var allOrderObjects = [];
      orders.forEach(function(myOrder){
        console.log("myOrder is", myOrder);
        let oneOrderObjectsArray = createOrderObjectsFromOrder(myOrder);
        console.log("one order", oneOrderObjectsArray);
        allOrderObjects = allOrderObjects.concat(oneOrderObjectsArray);
      });
      this.setData({allOrderObjects});
      console.log("allOrderObjects", allOrderObjects);
    }
  },


  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})