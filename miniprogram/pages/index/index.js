/**
 * On Load, page gets the home page data from the cloud and sets to local storage.
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
    //Upload the featured event and product objects to the page data
    this.setData({
      eventObjects,
      productObjects
    });
    

  }
})