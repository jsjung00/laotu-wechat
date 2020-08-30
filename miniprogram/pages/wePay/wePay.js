// miniprogram/pages/wePay.js
Page({

  /**
   * Page initial data
   */
  data: {
    subTotal: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log("options carried over", options)
    this.data.subTotal = options.subtotal
    console.log(data)
  },
  pay: function(event){
    //Send 0.1 yuan to Laotu.
    wx.cloud.callFunction({
    name: 'cloudPay',
    data: {total_fee: this.data.subTotal}
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