// miniprogram/pages/checkout.js
/**
 * Page uses the boolean shippingInfoComplete which represents whether or not the user has already set a shipping info.
 *    shippingInfoComplete is determined and set onLoad and onShow which queries the collection 'userInfo'
 * If default shippingInfo from userInfo is already set, then display the default shipping info. Else, ask to enter info. 
 *    In both cases, if the user decides to edit/enter info, navigate to editShippingInfo and pass in '?setUserInfo=false'
 *    editShippingInfo.js will upload 'shippingInfo' to globalData.
 * On page show (if page came from a higher layer page), reupload the shippingInfo data to display the right data
 *    and change the shippingInfoComplete = true   
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
    let subTotal = options.subtotal;
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
  payClicked : function(e){
    console.log("checkout page- payClicked()");
    //Called when the user clicks on the pay button
    //Check that the order detail (shippingInfo) is set and complete
    if (this.data.shippingInfoComplete === true){
      //Upload the order information to the userInfo

      var currentOrderObject = {
        streetName: this.data.streetName,
        phoneNumber : this.data.phoneNumber,
        phoneCode : this.data.phoneCode,
        name : this.data.name,
        regionCityDistrictArray : this.data.regionCityDistrictArray,
        totalPrice : this.data.orderTotal,
        cartQuantityObjects : this.data.cartQuantityObjects  
      };
      wx.cloud.callFunction({
        name : 'addOrderObject',
        data : {
          newOrderObject : currentOrderObject
        }
      }).then(() => console.log("Successfully added order object to cloud"))
        .catch(err => console.error(err));
      
      //Send our transaction to wePay
      
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
    
  }
})