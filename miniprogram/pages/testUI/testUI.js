// miniprogram/pages/testUI.js
Page({

  /**
   * Page initial data
   */
  data: {
    list: [{
      "text": "Home",
      "iconPath": "../../images/tabbar_icon_chat_default.png",
    "selectedIconPath": "../../images/tabbar_icon_chat_active.png",
      dot: true
    },
    {
        "text": "Event",
      "iconPath": "../../images/tabbar_icon_setting_default.png",
      "selectedIconPath": "../../images/tabbar_icon_setting_active.png",
        badge: 'New'
    },
    {
      "text": "Store",
    "iconPath": "../../images/tabbar_icon_setting_default.png",
    "selectedIconPath": "../../images/tabbar_icon_setting_active.png",
      badge: 'New'
    },
    {
      "text": "Event",
    "iconPath": "../../images/tabbar_icon_setting_default.png",
    "selectedIconPath": "../../images/tabbar_icon_setting_active.png",
      badge: 'New'
    }],
    active: 0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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
  onTabChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
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