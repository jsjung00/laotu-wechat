// miniprogram/pages/shoppingCart.js
/**
 * In order to display the cart items, the page uses a local array called cartDetailObjects which is pulled from the cloud and
 *   modified to be of the form [{id: "", titleStr: ""..., isHidden : Boolean}]. isHidden will determine whether or not the
 *   itemCard should be displayed (using <view hidden="{{isHidden}}"/>).
 *   Whenever a itemCard is deleted (click on the trash icon), the idHidden boolean in that cartDetailObject is false.
 * In order to manage the quantity, onLoad the array of cartQuantityObjects is pulled from the cloud and modified which looks like
 *    [{id: "", quantity: Number, price: Number}].
 * To calculate the price, there is a local variable called totalPrice which is simply the sum of the quantity*price in the
 *    cartQuantity array.
 * 

 */
Page({

  /**
   * Page initial data
   */
  data: {
    
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    //Grab the array of cartDetailObjects from the cloud and then add "isHidden" : false to each object.
    let cartDetailObjectsResp = await wx.cloud.callFunction({
      name: 'getCartDetailObjects'
    });
    let _cartDetailObjects = cartDetailObjectsResp.result.cartDetailObjects;
    let cartDetailObjects = _cartDetailObjects.map(obj => Object.assign(obj, {isHidden : false}));
    //Upload cartDetailObjects to the page data
    this.setData({cartDetailObjects});

    //Grab the array of cartQuantityObjects from the cloud
    let cartQuantityObjectsResp = await wx.cloud.callFunction({
      name : 'getUserCart'
    });
    let _cartQuantityObjects = cartDetailObjectsResp.result.cartProducts;
    //For each object, we need to add the price : Number 
    

    
    


  },
  click: function(){
    console.log("click()");
    this.setData({isHidden: true});
  }

})