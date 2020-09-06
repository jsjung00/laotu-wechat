/**
 * On Load, page gets the home page data from the cloud and sets to local storage.
 * For the more products or more events redirection, set a global variable boolean called 'displayFeaturedProductsTab' for
 *    the products page and global variable called 'displayFeaturedEventsTab' which is for events page 
 */
const app = getApp();

Page({
  data:{
    indicatorDots: true,
    autoplay: false,
    interval: 2000,
    duration: 500,
    circular: true,
    //aboveSwiperImages: ["url", "url"] //For the aboveSwiper
    //belowSwiperImages: ["url","url"]
    //featureEventsID : ["id", "id"]
    //featureProductsID : ["id", "id"]

  },
  onLoad: async function(options){
    var that = this;
    //Get our page data from the cloud
    const db = wx.cloud.database({
      env: 'laotudata-laotu'
    });
    try{
      var response = await db.collection('homePageData').limit(1).get();
    }catch{
      console.error("indexJS: Failed to get homePageData from cloud");
      var reloadPage = () => {wx.switchTab({
        url: '../index/index',
      })};
      wx.showToast({
        title: 'Network Crash',
        icon : 'none',
        complete : reloadPage
      });
    }
    
    try{
      let favEventsResponse = await db.collection('userFavEvents').where({
        _openid : "dfaidhfoashdfiodsahf"
      }).get();
      console.log("NOPE");
      console.log(favEventsResponse);
    }catch(e){
      //User's record does not exist- init record
      console.log("CONFIRMED");  

    }
  

    //Set the page data to the local storage
    var pageData = response.data[0];
    const aboveSwiperImages = pageData.aboveSwiperImagesSrc;
    const belowSwiperImages= pageData.belowSwiperImagesSrc;
    const featureEventsID = pageData.featureEventsID;
    const featureProductsID = pageData.featureProductsID;
    that.setData({
      aboveSwiperImages,
      belowSwiperImages,
      featureEventsID,
      featureProductsID
    });
    
    //Grab the featured Events and Products objects from cloud function
    try{
      var featuredResp = await wx.cloud.callFunction({
        name : 'getFeaturedObjects'
      });
    } catch (e){
      console.error("Failed to get featured objects from cloud", e);
      var reloadPage = () => {wx.switchTab({
        url: '../index/index',
      })};
      wx.showToast({
        title: 'Network Crash',
        icon : 'none',
        complete : reloadPage
      });
    }

    let featuredObject = featuredResp.result;
    let eventObjects = featuredObject.eventObjects;
    let productObjects = featuredObject.productObjects;
    console.log("productObj", productObjects);
    //Upload the featured event and product objects to the page data
    this.setData({
      eventObjects,
      productObjects
    });
  },
  clickEventsMore: function(e){
    //Called when the user clicks on the more button of the featured events container
    //Should navigate to an events page that contains only the featured query
    console.log("DEV: implement navigate to featured events page");
  },
  clickProductsMore: function(e){
    //Called when the user clicks on the more button of the featured products container

  },
  clickedProductCard: function(e){
    //Called when user clicks a specific product card
    let productID = e.currentTarget.dataset.productid;
    if (productID == null){
      throw new Error("clickedProductCard: product object could not deliver ID");
    }
    //Navigate to the item page and pass the productID
    wx.navigateTo({
      url: "../item/item",
      //Pass in the productID
      success: function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage', {id : productID, type : "product"});
      },
      fail: function(err){
        console.error("Failed to pass productID to itempage from index", err);
      }
    });
  },
  clickProductsMore : function(e){
    //Called when the user clicks on featured products row
    //Let products page know that the featured products should be the initial tab
    app.globalData.displayFeaturedProductsTab = true;
    //Navigate to the products page and 
    wx.switchTab({
      url : "../product/product"
    }); 
  },
  clickEventsMore : function(e){
    //Called when the user clicks on featured products row
    //Let products page know that the featured products should be the initial tab
    app.globalData.displayFeaturedEventsTab = true;
    //Navigate to the products page and 
    wx.switchTab({
      url : "../events/events"
    }); 
  }
})