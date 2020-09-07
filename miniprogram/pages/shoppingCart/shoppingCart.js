// miniprogram/pages/shoppingCart.js
/**
 * Page opens when user clicks on the buy button from item.wxml and is redirected here.
 *    In order to prevent race condition, page needs to wait until item.js sets the global variable 'addItemComplete' to true
 *    before page queries user cart from the cloud. 
 *    Then, page sets 'addItemComplete' to false immediately after to keep the communication going.
 *    
 * In order to display the cart items, the page uses a local array called cartDetailObjects which is pulled from the cloud and
 *   modified to be of the form [{id: "", titleStr: ""..., isHidden : Boolean, quantity: Number}]. isHidden will determine whether or not the
 *   itemCard should be displayed (using <view hidden="{{isHidden}}"/>).
 *   Whenever a itemCard is deleted (click on the trash icon), the idHidden boolean in that cartDetailObject is false.
 * In order to manage the quantity, onLoad the array of cartQuantityObjects is pulled from the cloud and modified which looks like
 *    [{id: "", quantity: Number, price: Number}].
 * To calculate the price, there is a local variable called totalPrice which is simply the sum of the quantity*price in the
 *    cartQuantity array.
 * When card is deleted, the isHidden attribute for that index is set to true in the cartDetailsObjects.
 *    Note that the index that is set for the cards at the beginning of the page load remains fixed for the duration of page, even if the card is hidden
 *    Thus, when a card is ""deleted"" it has isHidden=true and a quantity of 0. 
 * When page closes, the userCart is updated to the cloud (ignores objects whose quantity is 0)
 * For the loading screen, there is a boolean called 'pageReady' which is set to true once the cartDetails and cartQuantityObjects
 *    arrays are both set to the local data.
 * 
 * cartDetailObjects: [{_id:str, title:str,....}] Array of objects in the checkout that take on the same datastructure as 
 *    objects in 'products' cloud collection
 * cartQuantityObjects : [{itemid: str, quantity: number, price: number}, {}]

 */

 var app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    subTotal : 0
    //pageReady : boolean
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    console.log("shopping onLoad()");
    var that = this;
    //To prevent race condition, wait until item.js sends global var 'addItemComplete' to true
    var checkAddItemComplete = function(){
      var addItemComplete;
      return new Promise(function(resolve, reject){
        var numLoops = 40;
        (function waitForAddItemComplete(){
          addItemComplete = app.globalData.addItemComplete;
          if (addItemComplete != true){
            //Continually loop until the data is set
            setTimeout(waitForAddItemComplete, 250);
            numLoops -= 1;
            //Only allow max 20 loops
            if (numLoops < 1){
              reject("shopping cart onload(): took too long to receive addItemComplete from item.js.");
            }
          }
          else{
            return resolve();
          }
        })();
      });
    }
    await checkAddItemComplete();
    console.log("from shoppingCart: addItem completed");
    //Reset addItemComplete to false
    app.globalData.addItemComplete = false;


    //Grab the array of cartDetailObjects from the cloud
    var cartDetailObjectsResp = await wx.cloud.callFunction({
      name: 'getCartDetailObjects'
    });
    var _cartDetailObjects = cartDetailObjectsResp.result.cartDetailObjects;
    console.log("_CARTDETAILOBJECTS", _cartDetailObjects);
    
    //Grab the array of cartQuantityObjects from the cloud
    var cartQuantityObjectsResp = await wx.cloud.callFunction({
      name : 'getUserCart'
    });
    console.log("cartQOResp", cartQuantityObjectsResp);
    var _cartQuantityObjects = cartQuantityObjectsResp.result.cartProducts;

    //Get the quantity of each product and add {quantity: Number} to each cartDetailObject
    var getQuantity = function(productID){
      console.log("productID is", productID, "type is", typeof productID);
      let _quantityObject = _cartQuantityObjects.filter(obj => obj.itemid === productID);
      if (_quantityObject.length < 1){
        console.error("RACE Could not find object to corresponding productID. shoppingCart onload()");
        //The user cart was updated after the cart detail objects was called. Try again
        throw new Error("shoppingCart.js: retry with updated cartDetailObject"); 
      } else{
        let quantity = _quantityObject[0].quantity;
        return quantity;
      }
      
    } 
    
    try{
      // For each detail object, add "isHidden" : false and quantity: itemQuantity
      var cartDetailObjects = _cartDetailObjects.map(obj => Object.assign(obj, {isHidden : false, quantity : getQuantity(obj._id)}));
      //Upload cartDetailObjects to the page data
      that.setData({cartDetailObjects});
    } catch(e){
      //Try again with updated cartDetailObjects
      cartDetailObjectsResp = await wx.cloud.callFunction({
        name: 'getCartDetailObjects'
      });
      _cartDetailObjects = cartDetailObjectsResp.result.cartDetailObjects;

      var cartDetailObjects = _cartDetailObjects.map(obj => Object.assign(obj, {isHidden : false, quantity : getQuantity(obj._id)}));
      //Upload cartDetailObjects to the page data
      that.setData({cartDetailObjects});
    }
    

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
    console.log("onLoad cartQaunt:", this.data.cartQuantityObjects);
    
    //Upload the price
    this.setSubTotal();

    //Set our pageReady boolean as true and display the page
    let pageReady = true;
    this.setData({pageReady});

  },
  onHide : async function(e){
    console.log("shoppingCart onHide()");
    //Update the user's cart (items and quantity) by pushing our local cartQuantityArray to the cloud
    //First, we remove the price and any object that has quantity 0 
    let cartProducts = this.data.cartQuantityObjects;  
    console.log("cartQuantity before anything:", cartProducts);
    var newCartProducts = [];
    for (let i=0; i < cartProducts.length; i++){
      console.log(cartProducts[i]);
      if (cartProducts[i].quantity === 0){
        console.log("product has no quantity- do not add to cartProducts array");
      }
      else{
        newCartProducts.push({itemid: cartProducts[i].itemid, quantity: cartProducts[i].quantity});
        console.log("Pushed object");
      }
    }
    console.log("my updated cloud cartproducts", newCartProducts);

    const openID = app.globalData.openid;
    if (openID == null){
      throw new Error("shoppingCart(): onHide. failed to get openID from global data");
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
  onUnload : async function(e){
    console.log("shoppingCart onUnload()");
    //Update the user's cart (items and quantity) by pushing our local cartQuantityArray to the cloud
    //First, we remove the price and any object that has quantity 0 
    let cartProducts = this.data.cartQuantityObjects;  
    console.log("cartQuantity before anything:", cartProducts);
    var newCartProducts = [];
    for (let i=0; i < cartProducts.length; i++){
      console.log(cartProducts[i]);
      if (cartProducts[i].quantity === 0){
        console.log("product has no quantity- do not add to cartProducts array");
      }
      else{
        newCartProducts.push({itemid: cartProducts[i].itemid, quantity: cartProducts[i].quantity});
        console.log("Pushed object");
      }
    }
    console.log("my updated cloud cartproducts", newCartProducts);

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
  quantityChange : async function(e){
    //First we wait for the pageReady===true which confirms that cartQuantityObjects is set
    var that = this;
    var checkPageReady = function(){
      var pageReady;
      return new Promise(function(resolve, reject){
        var numLoops = 40;
        (function waitForPageReady(){
          pageReady = that.data.pageReady;
          if (pageReady != true){
            //Continually loop until the data is set
            setTimeout(waitForPageReady, 250);
            numLoops -= 1;
            //Only allow max 20 loops
            if (numLoops < 1){
              reject("shopping cart clicktrash(): page ready took too long to set.");
            }
          }
          else{
            return resolve();
          }
        })();
      });
    }
    await checkPageReady();
    //Called when the stepper quantity is changed
    let cardIndex = e.currentTarget.dataset.idx;
    //update the cartQuantityObjects array with the new quantity
    let cartQuantityObjects = this.data.cartQuantityObjects;
    console.log("current quantity: ", e.detail);
    console.log("MY CARTQUANTOBJECTS", cartQuantityObjects);
    console.log("MY SPECIFIC OBJECT", cartQuantityObjects[cardIndex]);
    console.log("MY CARDINDEX", cardIndex, "TYPE OF",typeof cardIndex);
    cartQuantityObjects[cardIndex].quantity = e.detail;
    this.setData({cartQuantityObjects});
    console.log("quantityChange cartQuant", this.data.cartQuantityObjects);

    //Update the subTotal
    this.setSubTotal();
  },
  clickCheckout : async function(e) {
    console.log("clickCheckout()");
    //Update the user's cart (items and quantity) by pushing our local cartQuantityArray to the cloud
    //First, we remove the price
    let cartProducts = this.data.cartQuantityObjects;  
    console.log("cartQuantity before anything:", cartProducts);
    var newCartProducts = [];
    cartProducts.forEach(obj => newCartProducts.push({itemid : obj.itemid, quantity : obj.quantity}));

    const openID = app.globalData.openid;
    if (openID == null){
      throw new Error("clickCheckout(). failed to get openID from global data");
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
    wx.navigateTo({
      url: '../../pages/checkout/checkout?subtotal=' + e.currentTarget.dataset.subtotal,
    });
  },
  clickTrash: async function(e){
    //Called when the trash icon in the card is clicked. 
    //Change the card's isHidden attribute to true
    //First we wait for the pageReady===true which confirms that cartDetailsObjects is set
    var that = this;
    var checkPageReady = function(){
      var pageReady;
      return new Promise(function(resolve, reject){
        var numLoops = 40;
        (function waitForPageReady(){
          pageReady = that.data.pageReady;
          if (pageReady != true){
            //Continually loop until the data is set
            setTimeout(waitForPageReady, 250);
            numLoops -= 1;
            //Only allow max 20 loops
            if (numLoops < 1){
              reject("shopping cart clicktrash(): page ready took too long to set.");
            }
          }
          else{
            return resolve();
          }
        })();
      });
    }
    await checkPageReady();

    console.log("clickTrash()");
    let cardIndex = e.currentTarget.dataset.idx;
    
    let cartDetailObjects = this.data.cartDetailObjects;
    //Hide the card (but not delete it) by setting isHidden to true
    cartDetailObjects[cardIndex].isHidden = true;
    this.setData({cartDetailObjects});
    
    //Set quantity to 0 from the cartQuantityObjects array
    let itemID = cartDetailObjects[cardIndex]._id;
    let cartQuantityObjects = this.data.cartQuantityObjects;
    console.log("CQO before trash", cartQuantityObjects);
    let trashedObjectIndex = cartQuantityObjects.findIndex(obj => obj.itemid === itemID);
    cartQuantityObjects[trashedObjectIndex].quantity = 0;
    console.log("CQO after trash", cartQuantityObjects);
    
    //Update the cartQuantityObjects array in the local data
    this.setData({cartQuantityObjects});
    //Change the price
    this.setSubTotal();
  }


})