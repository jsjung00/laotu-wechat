var app = getApp();
Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
    statusHeight: {
      type: String,
      value: app.globalData.statusHeight,
    },
    navHeight : {
      type: String,
      value: app.globalData.navContainerHeight,
    },
    capsuleContainerWidth : {
      type : String,
      value : app.globalData.capsuleContainerWidth,
    },
    capsuleWidth : {
      type : String,
      value: app.globalData.capsuleContainerWidth - 20,
    },
    capsuleHalfWidth : {
      type: String,
      value : (app.globalData.capsuleContainerWidth - 20) / 2,
    },
    isBack : {
      type: Boolean,
      value: false,
    },
    isHome : {
      type: Boolean,
      value: false,
    },
    isBoth : {
      type: Boolean,
      value: false,
    }
  }
});
