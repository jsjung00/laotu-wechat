//app.js
App({
  onLaunch: function () {
    
    //upload the capsle button information to help build nav bar
    this.globalData.headerButtonPos = wx.getMenuButtonBoundingClientRect();

    //upload events data
    this.uploadData();
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: err => console.log("Get User Info Failed") 
          })
        }
        else{
        }
      },
      fail: err => console.log("Get setting failed") 
    })
    wx.getSystemInfo({
      success: (result) => {
        this.globalData.statusHeight = result.statusBarHeight;
        //Calculate and upload the nav dimension details
        //here I calculate the height of the button and the top margin of the capsule
        let capsulePos = this.globalData.headerButtonPos;
        let capsuleHeight = capsulePos.height;
        let capsuleWidth = capsulePos.width;
        let capsuleTop = capsulePos.top;
        let statusHeight = this.globalData.statusHeight;
        //margin is top location minus status height
        let topMargin = capsuleTop - statusHeight; 
        //NOTE: left margin is always 10px
        
        console.log("stat height is " + statusHeight);
        //we make the capsule in the very middle
        let navHeight = (2 * topMargin) + capsuleHeight;
        //we make the capsule container width = capsuleWidth + 20
        let capsuleContainerWidth = capsuleWidth + 20;
        this.globalData.capsuleContainerWidth = capsuleContainerWidth;
        this.globalData.navContainerHeight = navHeight;

        //Upload screen height and window height
        let screenHeight = result.screenHeight;
        this.globalData.screenHeight = screenHeight;
        this.globalData.windowHeight = result.windowHeight;
      },
    })
  },
  uploadData: function(){
    //we would pull data from server
    const eventsTabData = {
      0 : {
        title: 'Upcoming',
        data : [{
          navUrl: "/pages/store/store",
          favSrc: "",
          date: '12/2/2019',
          title: 'Museum Visit',
          location: 'Shanghai, China',
          imgSrc: 'https://www.travelchinaguide.com/images/photogallery/2013/0923111908.jpg'
        },{
          navUrl: "/pages/store/store",
          favSrc: "",
          date: '2/3/2019',
          title: 'Zoo Visit',
          location: 'Beijing, China',
          imgSrc: 'https://www.travelchinaguide.com/images/photogallery/2013/0923111908.jpg'
        },
        {
          navUrl: "/pages/store/store",
          favSrc: "",
          date: '4/1/2019',
          title: 'Palace Visit',
          location: 'Beijing, China',
          imgSrc: 'https://www.travelchinaguide.com/images/photogallery/2013/0923111908.jpg'
        },
        {
          navUrl: "/pages/store/store",
          favSrc: "",
          date: '2/3/2019',
          title: 'Zoo Visit',
          location: 'Beijing, China',
          imgSrc: 'https://www.travelchinaguide.com/images/photogallery/2013/0923111908.jpg'
        },
        {
          navUrl: "/pages/store/store",
          favSrc: "",
          date: '4/1/2019',
          title: 'Palace Visit',
          location: 'Beijing, China',
          imgSrc: 'https://www.travelchinaguide.com/images/photogallery/2013/0923111908.jpg'
        }
        ]
      },
      1 : {
        title: 'Former',
        data : [],
      },
    };
    //upload the events tab data to the global data
    this.globalData.eventsTabData = eventsTabData;

    //init the favoriteEventsTabData
    let favoriteData = {};
    let eventsData = this.globalData.eventsTabData;
    let eventsKeys = Object.keys(eventsData);
    for (const key in eventsKeys){
      favoriteData[key] = {};
    };
    this.globalData.favoriteEventsTabData = favoriteData;
  },
  globalData: {
    userInfo: null,
    statusHeight : null,
    headerButtonPos : {},
    sysInfo : {},
    navContainerHeight : null,
    capsuleContainerWidth : null,
    screenHeight : 0,
    windowHeight : 0,
    eventsTabData: {},
    favoriteEventsTabData: {},
  }
})