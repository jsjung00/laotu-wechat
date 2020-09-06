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

  },
  eventClicked: function(e){
    //Function is called when user clicks on card
    //Navigate to the item page
    let type = 'event';
    let itemID = e.currentTarget.dataset.itemid;
    console.log("event itemID is", itemID);

    wx.navigateTo({
      url: '../item/item',
      success: function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage', {type: type, id: itemID});
      },
      fail: function(err){
        console.error(err);
      }
    });
  },
  buyClicked: function(e){
    //Function is called when the user clicks on the buy button
    //
  }
})