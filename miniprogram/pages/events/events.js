// miniprogram/pages/events.js
/**
 * See product.js documentation. Quite similar
 */
var app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex : 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    var that = this;
    //Get an array of search result objects (events)
    let eventsResponse = await wx.cloud.callFunction({
      name: "getEventsArray"
    })
    let events = eventsResponse.result.events.data;
    console.log("Events array is: ", events);
    //Upload our products array into the page data
    this.setData({
      eventsArray: events
    });
    //Get the array of categoryEventObjects which will be passed to the tabbar swiper
    try{
      var _categoryEventArray = await wx.cloud.callFunction({
        name : "getCategoryEvents"
      });
      var categoryEventArray = _categoryEventArray.result.data;
    } catch (e){
      console.error("events.js: failed to call getCategoryEvents() cloud function", e);
    }
    //Change the activeTabIndex if the global data specifies to display featured products
    if (app.globalData.displayFeaturedEventsTab === true){
      //Get the tab index for featured
      const featuredTabIndex = categoryEventArray.findIndex(obj => obj.categoryName === 'Featured');
      //Set the default active tab to the featured tab
      that.setData({activeTabIndex : featuredTabIndex});
    } 

    //Upload the categoryEventObjects to the page for the swiper
    this.setData({categoryEventArray});

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },
  eventCardClick: function(e){
    //Function is called when user clicks on card
    //Navigate to the item page
    console.log("eventCardClick")
    let itemID = e.currentTarget.dataset.itemid;
    console.log("event itemID is", itemID);

    wx.navigateTo({
      url: '../eventItem/eventItem?itemid=' + itemID
    });
  },
  buyClicked: function(e){
    //Function is called when the user clicks on the buy button
    //
  }
})