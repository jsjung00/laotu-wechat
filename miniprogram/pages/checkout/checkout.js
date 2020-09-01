// miniprogram/pages/checkout.js
var app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    orderTotal : 0.1
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    //Set the tabbar Height to pass into the CustomTabBar component
    let tabBarHeight = app.globalData.tabbarHeight;
    this.setData({
      tabBarHeight
    });

    //Upload the subtotal passed from the shopping cart page
    let subTotal = options.subtotal;
    this.setData({subTotal});
    var that = this;
    //Grab the array of cartDetailObjects from the cloud
    let cartDetailObjectsResp = await wx.cloud.callFunction({
      name: 'getCartDetailObjects'
    });
    let cartDetailObjects = cartDetailObjectsResp.result.cartDetailObjects;
    
    //Grab the array of cartQuantityObjects from the cloud
    let cartQuantityObjectsResp = await wx.cloud.callFunction({
      name : 'getUserCart'
    });
    console.log(cartQuantityObjectsResp);
    let _cartQuantityObjects = cartQuantityObjectsResp.result.cartProducts;

    //For each quantity object, we need to add the price : Number 
    var getPrice = function(productID){
      let _productObject = cartDetailObjects.filter(obj => obj._id == productID);
      if (_productObject.length < 1){
        throw new Error("Could not find object to corresponding productID. shoppingCart onload()");
      }
      let price = _productObject[0].price;
      return price;
    }
    let cartQuantityObjects = _cartQuantityObjects.map(obj => Object.assign(obj, {price : getPrice(obj.itemid)}));

    //Upload cartDetailObjects to the page data
    this.setData({cartDetailObjects});
    //Upload cartQuantityObjects to the page data
    this.setData({cartQuantityObjects});
    
    //Set our pageReady boolean as true and display the page
    let pageReady = true;
    this.setData({pageReady});
  },
  payClicked : function(e){
    console.log("checkout page- payClicked()");
    //Let's send money!
    
  }
})