// 云函数入口文件
const cloud = require('wx-server-sdk');
const random = require('random.js');
const crypto = require('crypto');
const requestData = require('requestData.js');
const request = require('request');
const xmlreader = require('xmlreader');



cloud.init({
  env: "laotudata-laotu",
  traceUser: true
});

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openID = wxContext.OPENID;
  const total_fee = event.total_fee;
  const spbil_create_ip = event.spbil_create_ip;
  const appid = 'wx24d2cda715af9d1b';
  const mch_id = '1601929795';
  const body = "Laotu Store- add more description later";
  //Unique number- we use the current datetime
  const out_trade_no = Date.parse(new Date()).toString();
  //in cents- 0.01 yen
  //const total_fee = 1;
  //const device_IP = '10.0.0.53';
  const notify_url = 'http://www.weixin.qq.com/wxpay/pay.php';
  const trade_type = 'JSAPI';
  //DEV NOTE: change to actual key
  const key = '1a79a4d60de6718e8e5b326e338ae533';
  //CHANGE KEY in String
  let stringA = 'appid=${appid}&body=${body}&mch_id=${mch_id}&nonce_str=${random}&notify_url=${notify_url}&openid=${openid}&out_trade_no=${out_trade_no}&spbill_create_ip=${spbill_create_ip}&total_fee=${total_fee}&trade_type=${trade_type}&key=1a79a4d60de6718e8e5b326e338ae533';
  var sign = crypto.createHash('md5').update(stringA).digest('hex').toUpperCase();
  const random = random();
  let dataBody = requestData(appid, mch_id, random, sign, body, out_trade_no, total_fee, spbill_create_ip, notify_url, trade_type, openid);

  //NOTEL: if this doesn't work, look at https://juejin.im/post/6844903901112582157
  return new Promise(resolve => {
    request({
      //官方统一下单api的url
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      //请求方法，post
      method: "POST",
      //需要传送的订单，就是刚刚我们生成的dataBody
      body: dataBody
    }, body => {
      xmlreader.read(body, res => {
        let prepay_id = res.xml.prepay_id.text();
        let timeStamp = Date.parse(new Date()).toString();
        //Change key
        let str = 'appId=${appid}&nonceStr=${random}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=1a79a4d60de6718e8e5b326e338ae533';
        let paySign = crypto.createHash('md5').update(str).digest('hex');
        resolve({
          data: {
            timeStamp: timeStamp,
            nonceStr: random,
            package: 'prepay_id=${prepay_id}',
            signType: 'MD5',
            paySign: paySign
          }
        })
      })
    })
  })

}