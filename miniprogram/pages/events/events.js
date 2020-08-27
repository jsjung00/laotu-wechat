// miniprogram/pages/events.js
/**
 * Get eventsArray from cloud and upload to page data for searchBar
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

  }
})