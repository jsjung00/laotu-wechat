//app.js
App({
  onLaunch: async function () {
    var that = this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'laotudata-laotu',
        traceUser: true,
      })
    }

    //Upload user info
    wx.cloud.callFunction({
      name: 'getIDInfo'
    })
      .then(function(res){
        let data = res.result;
        let openid = data.openid;
        //set openid to globalData;
        that.globalData.openid = openid;
      })
      .catch(err => console.log("Failed to get user info in app.js", err))
    
      //Upload fonts
      wx.loadFontFace({
        family: 'Bitstream Vera Serif Bold',
        source: 'url("https://sungd.github.io/Pacifico.ttf")'
      });

    //Upload the information of the built-in right capsule button to globalData
    try{
      var capsulePosition = wx.getMenuButtonBoundingClientRect();
      this.globalData.capsulePosition = capsulePosition;
    }catch(e){
      console.error("App.js: failed to get capsule button information client rect", e);
    }
    
    //Default app.js that I did not change
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
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
    });

    //Grab the systemInfo and upload information about the capsule button and screen
    try{
      var res = wx.getSystemInfoSync();
      let statusHeight = res.statusBarHeight;
      //Confirm that getMenuButtonBoundingRectClient returned
      if (capsulePosition == null){
        throw new Error("Race condition: failed to get buttonClientRect in time");
      }  
      let capsuleHeight = capsulePosition.height;
      let capsuleWidth = capsulePosition.width;
      let capsuleTop = capsulePosition.top;
      //Calculate the margin of capsule and the statusBar
      let capsuleTopMargin = capsuleTop - statusHeight;
      //Vertically center our capsule with some calculations
      let navBarHeight = (capsuleTopMargin * 2) + capsuleHeight;
      //Capsule left-margin is always 10px
      let capsuleLeftMargin = 10;
      //Upload statusHeight, navBarHeight, capsuleWidth
      this.globalData.statusHeight = statusHeight;
      this.globalData.navBarHeight = navBarHeight;
      this.globalData.capsuleWidth = capsuleWidth;
      //Upload screenHeight, windowHeight
      let screenHeight = res.screenHeight;
      this.globalData.screenHeight = screenHeight;
      let windowHeight = res.windowHeight;
      this.globalData.windowHeight = res.windowHeight;
      //Upload the tabbarHeight
      this.globalData.tabbarHeight = screenHeight - windowHeight;  
    }
    catch (e){
      console.error("App.js: Failed to upload information about capsule button and screen", e);
    }
  },
  globalData: {
    userInfo: null,
    sysInfo : {}
  }
})