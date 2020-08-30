// miniprogram/pages/shoppingCart.js
/**
 * In order to display the cart items, the page uses a local array called cartDetailObjects which is pulled from the cloud and
 *   modified to be of the form [{id: "", titleStr: ""..., isHidden : Boolean, quantity: Number}]. isHidden will determine whether or not the
 *   itemCard should be displayed (using <view hidden="{{isHidden}}"/>).
 *   Whenever a itemCard is deleted (click on the trash icon), the idHidden boolean in that cartDetailObject is false.
 * In order to manage the quantity, onLoad the array of cartQuantityObjects is pulled from the cloud and modified which looks like
 *    [{id: "", quantity: Number, price: Number}].
 * To calculate the price, there is a local variable called totalPrice which is simply the sum of the quantity*price in the
 *    cartQuantity array.
 *When page closes, the userCart is updated (the quantity and the items in the array may change) 

 */

 var app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    subTotal : "Loading" 
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    //Grab the array of cartDetailObjects from the cloud
    let cartDetailObjectsResp = await wx.cloud.callFunction({
      name: 'getCartDetailObjects'
    });
    let _cartDetailObjects = cartDetailObjectsResp.result.cartDetailObjects;
    
    //Grab the array of cartQuantityObjects from the cloud
    let cartQuantityObjectsResp = await wx.cloud.callFunction({
      name : 'getUserCart'
    });
    console.log(cartQuantityObjectsResp);
    let _cartQuantityObjects = cartQuantityObjectsResp.result.cartProducts;

    //Get the quantity of each product and add {quantity: Number} to each cartDetailObject
    var getQuantity = function(productID){
      let _quantityObject = _cartQuantityObjects.filter(obj => obj.itemid == productID);
      if (_quantityObject.length < 1){
        throw new Error("Could not find object to corresponding productID. shoppingCart onload()");
      }
      let quantity = _quantityObject[0].quantity;
      return quantity;
    } 
    
    // For each detail object, add "isHidden" : false and quantity: itemQuantity
    let cartDetailObjects = _cartDetailObjects.map(obj => Object.assign(obj, {isHidden : false, quantity : getQuantity(obj._id)}));
    //Upload cartDetailObjects to the page data
    this.setData({cartDetailObjects});

    
    
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
    //Upload cartQuantityObjects to the page data
    this.setData({cartQuantityObjects});
    
    //Upload the price
    this.setSubTotal();


  },
  onUnload : async function(e){
    //Update the user's cart (items and quantity) by pushing our local cartQuantityArray to the cloud
    //First, we remove the price
    var newCartProducts = this.data.cartQuantityObjects;
    newCartProducts.forEach(obj => delete obj.price);

    const openID = app.globalData.openid;
    if (openID == null){
      throw new Error("shoppingCart(): onUnload. failed to get openID from global data");
    }
    const db = wx.cloud.database({env : 'laotudata-laotu'});
    let response = await db.collection('userCart').where({
      _openid : openID
    }).update({
      data: {
        cartProducts : newCartProducts
      },
      fail: function(err){
        console.error(err);
      }
    });
    


  },
  setSubTotal: function(){
    //Called whenever the quantity is changed. Calculates the price using cartQuantityObjects array
    let cartQuantityObjects = this.data.cartQuantityObjects;
    console.log(cartQuantityObjects);
    var subTotal = 0;
    cartQuantityObjects.forEach(obj => subTotal += (obj.price * obj.quantity));
    console.log("subtotal is ", subTotal);
    this.setData({subTotal});
    
  },
  quantityChange : function(e){
    //Called when the stepper quantity is changed
    let cardIndex = e.currentTarget.dataset.idx;
    //update the cartQuantityObjects array with the new quantity
    let cartQuantityObjects = this.data.cartQuantityObjects;
    console.log("current quantity: ", e.detail);
    cartQuantityObjects[cardIndex].quantity = e.detail;
    this.setData({cartQuantityObjects});

    //Update the subTotal
    this.setSubTotal();
  }


})