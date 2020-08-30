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
    subTotal : "Loading" 
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
    console.log(cartQuantityObjectsResp);
    let _cartQuantityObjects = cartQuantityObjectsResp.result.cartProducts;
    
    //For each object, we need to add the price : Number 
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