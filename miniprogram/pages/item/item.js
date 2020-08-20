// miniprogram/pages/item.js
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 2000,
    duration: 500,
    vertical: false,
    itemImages : [], //array of imgSrcs which are strings
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    //Set the tabbar Height to pass into the CustomTabBar component
    let tabbarHeight = app.globalData.tabbarHeight;
    this.setData({
      tabbarHeight
    });
    console.log(this.data.tabbarHeight);

    //Get the itemID and the type

    //Upload the item images


  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

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