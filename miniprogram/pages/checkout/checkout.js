var util = require('../../utils/util.js');
// miniprogram/pages/checkout.js
/**
 * Page uses the boolean shippingInfoComplete which represents whether or not the user has already set a shipping info.
 *    shippingInfoComplete is determined and set onLoad and onShow which queries the collection 'userInfo'
 * If default shippingInfo from userInfo is already set, then display the default shipping info. Else, ask to enter info. 
 *    In both cases, if the user decides to edit/enter info, navigate to editShippingInfo and pass in '?setUserInfo=false'
 *    editShippingInfo.js will upload 'shippingInfo' to globalData.
 * On page show (if page came from a higher layer page), reupload the shippingInfo data to display the right data
 *    and change the shippingInfoComplete = true   
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
    //orderTotal : 
    //shippingInfoComplete
    //fromAbovePage : Boolean (true if the user has just navigated back to the checkout)
    //city
    //province
    //district
    //streetName
    //name
    //phoneNumber
    //phoneCode
    //cartDetailObjects  
      
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    var that = this;
    //Set the tabbar Height to pass into the CustomTabBar component
    let tabBarHeight = app.globalData.tabbarHeight;
    this.setData({
      tabBarHeight
    });
    //Upload the subtotal passed from the shopping cart page
    //Convert the string to a number
    let subTotal = parseInt(options.subtotal);

    this.setData({subTotal});
    
    var that = this;

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
    let cartDetailObjects = _cartDetailObjects.map(obj => Object.assign(obj, {quantity : getQuantity(obj._id)}));

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
    //Upload shipping and total cost
    this.uploadOrderCosts();
    
    //Set our pageReady boolean as true and display the page
    let pageReady = true;
    this.setData({pageReady});

    //Determine whether or not the user already has the default shipping address set
    let userInfoResp = await wx.cloud.callFunction({
      name : 'getUserInfo'
    });
    let userInfo = userInfoResp.result.userInfo[0];
    let shippingInfo = userInfo.shippingInfo;
    console.log(userInfo);
    //Check if the shippingInfo is empty (will either be {} or complete due to the tests in editShoppingInfo)
    var shippingInfoComplete;
    if (shippingInfo == null){
      shippingInfoComplete = false;
    }
    else if (Object.values(shippingInfo).length < 1){
      shippingInfoComplete = false;
    }
    else{
      shippingInfoComplete = true;
    }
    this.setData({shippingInfoComplete});
    //If complete, upload the streetName, the city, the district, and the name
    if (shippingInfoComplete){
      this.setData({
        streetName: shippingInfo.streetName,
        city : shippingInfo.regionCityDistrictArray[1],
        district : shippingInfo.regionCityDistrictArray[2],
        province : shippingInfo.regionCityDistrictArray[0],
        phoneNumber : shippingInfo.phoneNumber,
        phoneCode : shippingInfo.phoneCode,
        name : shippingInfo.name ,
        regionCityDistrictArray : shippingInfo.regionCityDistrictArray            
        });
    }
    //If not complete, the wxml will render an button to link to editShippingInfo
  },
  onShow : async function(e){
    //Called when the page first loads and also when the user returns back to the page
    //Reupload shipping/order data if user has returned from edit order/shipping details page
    if (this.data.fromAbovePage === true){
      console.log("Navigated back to checkout");
      //Determine whether or not user successfully edited (added in) shipping info details
      var shippingInfoEdited;
      var checkShippingInfoEdit = function(){
        return new Promise(function(resolve, reject){
          var numLoops = 40;
          (function waitForShippingInfoEdit(){
            shippingInfoEdited = app.globalData.shippingInfoEdited;
            if (shippingInfoEdited == null){
              //Continually loop until the data is set
              setTimeout(waitForShippingInfoEdit, 250);
              numLoops -= 1;
              //Only allow max 20 loops
              if (numLoops < 1){
                reject("checkout onshow(): shippingInfoEdited took too long to set.");
              }
            }
            else{
              return resolve();
            }
          })();
        });
      }
      await checkShippingInfoEdit();
      if (shippingInfoEdited === false){
        //User did not edit the address, keep things the same
        return;
      }
      else{
        //User edited the address, change the shippingInfo in the page data 
        //Grab shippingInfo from globalData that is set by editShippingInfo.js
        var shippingInfo;
        //Make sure to wait for shippingInfo
        var checkShippingInfo = function(){
          return new Promise(function(resolve, reject){
            var numLoops = 40;
            (function waitForShippingInfo(){
              shippingInfo = app.globalData.shippingInfo;
              if (shippingInfo == null){
                //Continually loop until the data is set
                setTimeout(waitForShippingInfo, 250);
                numLoops -= 1;
                //Only allow max 20 loops
                if (numLoops < 1){
                  reject("checkout onshow(): shippingInfo took too long to set.");
                }
              }
              else{
                return resolve();
              }
            })();
          });
        }
        await checkShippingInfo();
        //Upload our shippingInfo and change the shippingInfoComplete boolean to true
        this.setData({
          streetName: shippingInfo.streetName,
          city : shippingInfo.regionCityDistrictArray[1],
          district : shippingInfo.regionCityDistrictArray[2],
          province : shippingInfo.regionCityDistrictArray[0],
          phoneNumber : shippingInfo.phoneNumber,
          phoneCode : shippingInfo.phoneCode,
          name : shippingInfo.name ,
          regionCityDistrictArray : shippingInfo.regionCityDistrictArray       
        });
        this.setData({shippingInfoComplete : true});
      }
    } 
    else {
      //Page has just loaded
      return; 
    }
  },
  onHide : function(e){
    //The user has navigated to another page upwards
    this.setData({fromAbovePage : true});
  },
  uploadOrderCosts : async function(e){
    console.log("uploadOrderCosts");
    //Upload the shippingCost and totalCost
    //Make sure that cartDetailObjects is set
    var that = this;
    var cartDetailObjects;
    var checkCartDetailObjects = function(){
      return new Promise(function(resolve, reject){
        var numLoops = 40;
        (function waitForCartDetailObjects(){
          cartDetailObjects = that.data.cartDetailObjects;
          if (cartDetailObjects == null){
            //Continually loop until the data is set
            setTimeout(waitForCartDetailObjects, 250);
            numLoops -= 1;
            //Only allow max 20 loops
            if (numLoops < 1){
              reject("checkout uploadOrderCosts(): cartDetailObjects took too long to set.");
            }
          }
          else{
            return resolve();
          }
        })();
      });
    }
    await checkCartDetailObjects();
    //Calculate the total shippingCost
    var shippingCost = 0;
    cartDetailObjects.forEach(obj => shippingCost += obj.shippingCost)
    var subTotal = this.data.subTotal;
    var totalFee = subTotal + shippingCost;
    this.setData({
      shippingCost : shippingCost,
      totalFee : totalFee
    });
  },
  payClicked : async function(e){
    var that = this;
    console.log("checkout page- payClicked()");
    wx.showLoading({
      title: 'Processing payment...'
    });

    //Called when the user clicks on the pay button
    //Check that the order detail (shippingInfo) is set and complete
    if (this.data.shippingInfoComplete === true){
      //Send our transaction to wePay
    
      //Make sure that the totalFee is fully calculated before we send it off to be transacted
      //NOTE: if totalFee is set, then our cartDetailObjects and cartQuantityObjects are set as well
      var totalFee;
      var checkFee = function(){
        return new Promise(function(resolve, reject){
          var numLoops = 40;
          (function waitForFee(){
            totalFee = that.data.totalFee;
            if (totalFee == null){
              //Continually loop until the data is set
              setTimeout(waitForFee, 250);
              numLoops -= 1;
              console.log("looping checkFee");
              //Only allow max 20 loops
              if (numLoops < 1){
                reject("checkout payClicked(): took too long for totalFee to be calculated.");
              }
            }
            else{
              return resolve();
            }
          })();
        });
      }
      try{
        await checkFee();
      }catch (e){
        console.log(e);
        throw new Error("Total Fee failed to calculate within 5 seconds. Break the program.");
      };  

      try{
        //Attempt to call our cloud function to send a transaction request
        var res = await wx.cloud.callFunction({
          name : 'sendPay',
          data : {
            totalFee : totalFee 
          }
        });
        wx.hideLoading();
        console.log("My paymentCloud result", res.result);
        //Conduct the payment through wx.requestPayment
        that.pay(res.result);

      }catch (e){
        console.error("Failed to make transaction to sendPay", e);
        wx.showToast({title : 'Failed to make transaction'});
        wx.hideLoading();
      }
      
    }
    else{
      //order information is incomplete/invalid
      wx.showToast({
        title : "Missing Order Details",
        icon : 'none',
        duration: 1000
      });
      console.log("shipping details is incomplete");
    }  
  },
  pay: function(payData){
    //Called once the payment transaction is complete (called by payClicked())
    var that = this;
    const payment = payData.payment;//这里注意，上一个函数的result中直接整合了这里要用的参数，直接展开即可使用
    const db = wx.cloud.database({env : 'laotudata-laotu', tracerUser: true});
    wx.requestPayment({
      ...payment, 
      success(res) {
        //Upload the order to the cloud collection 'orders'
        db.collection('orders').add({
          data: {
            orderInfo : res,
            transactionTime : db.serverDate()
          },
          success: function(res){
            wx.showToast({title: 'Added order info to cloud database', icon: 'none'});
          },
          fail: function(res){
            wx.showToast({title: 'Failed to add order info to cloud database', icon: 'none'});
          }
        });
        //Upload the order information to the userInfo
        var currentDateTime = util.formatTime(new Date());
        var currentOrderObject = {
          streetName: this.data.streetName,
          phoneNumber : this.data.phoneNumber,
          phoneCode : this.data.phoneCode,
          name : this.data.name,
          regionCityDistrictArray : this.data.regionCityDistrictArray,
          totalPrice : this.data.orderTotal,
          cartQuantityObjects : this.data.cartQuantityObjects,
          cartDetailObjects : this.data.cartDetailObjects,
          dateTime : currentDateTime  
        };
        wx.cloud.callFunction({
          name : 'addOrderObject',
          data : {
            newOrderObject : currentOrderObject
          }
        }).then(() => console.log("Successfully added order object to cloud"))
          .catch(err => console.error(err)); 
      },
      fail(res) {
        console.error('pay fail', res)
      }
    })
  }
})