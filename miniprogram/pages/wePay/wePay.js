// miniprogram/pages/wePay.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },
  pay: function(event){
    //Send 0.1 yuan to Laotu.
    wx.cloud.callFunction({
    name: 'cloudPay',
    data: {total_fee: 1}
    }).then(res => {
      wx.requestPayment({
        nonceStr: res.result.data.nonceStr,
        package: res.result.data.package,
        paySign: res.result.data.signType,
        timeStamp: res.result.data.timeStamp,
        success: res => {
          console.log("Successful payment");
        },
        fail: err => {
          console.error("Failed to make payment");
        }
      });
    });
  }
})