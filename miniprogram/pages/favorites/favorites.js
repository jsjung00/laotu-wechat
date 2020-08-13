const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tabs: [],
    activeTab: 0 ,
    tableHeight: 100
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    //Call getFavTabData to get the tab data as an array
    wx.cloud.callFunction({
      name: 'getFavTabData',
      success: function(res){
        //Upload our tabData to the page
        that.setData({
          tabs: res.result.favTabData
        })
      },
      fail: console.error
    });
    
    
  
  },
  onTabClick(e) {
    const index = e.detail.index;
    console.log("tab clicked");
    this.setData({ 
      activeTab: index 
    })
  },

  onChange(e) {
    const index = e.detail.index;
    console.log("Something changed");
    this.setData({ 
      activeTab: index 
    })
    /* I  calculate and upload the height of the events table */
    let tabData = this.data.tabs[index].data;
    let numEvents = tabData.length;
    //Every container is 20vh
    let height = String(numEvents * 20);
    this.setData({
      "tableHeight" : height
    });
    console.log("Table Height is: " + this.data.tableHeight); 

  },
  handleClick(e) {
      console.log("Handle Clicked");
  },
  objectToArray: function(obj){
    let outerArray = Object.values(obj);
    var tabs = [];
    outerArray.forEach(function(o){
      let innerArray = Object.values(o);
      tabs.push(innerArray);
    });
    return tabs;
  }
})