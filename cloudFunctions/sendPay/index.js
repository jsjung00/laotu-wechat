/**
 * Makes a transcation of an integer amount and stores additional orderData for tracking
 * Parameters : 'totalFee' - Number: the total transaction amount
 * DEV NOTE: CHANGE BACK FROM TOTALFEE = 1
 *                
 *  */ 

const cloud = require('wx-server-sdk')

cloud.init({env : 'laotudata-laotu'});

function random(){
  var result = '';
  const wordList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
  'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2',
  '3', '4', '5', '6', '7', '8', '9', '0'];
  for(let i=0;i<31;i++){
    result += wordList[Math.round(Math.random()*35)]
  }
  return result;
}


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const open_id = wxContext.OPENID;
  //Unique number is defined by the current datetime
  const out_trade_no = Date.parse(new Date()).toString();
  //Assume that actual sp_bill_ip doesn't matter
  const sp_bill_ip = "127.0.0.1";
  //Generate a random string of 31 alphanumeric 
  const nonce_str = random();
  //DEV NOTE: CHANGE BACK TO  const total_fee = event.totalFee;
  const total_fee = 1;
  const trade_type = 'JSAPI';
  console.log("nonce", nonce_str, "out_trade", out_trade_no);
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : "Laotu Store- Organic Product and Beauty Products",
    "outTradeNo" : out_trade_no,
    "spbillCreateIp" : sp_bill_ip,
    "subMchId" : "1601929795",
    "nonceStr" : nonce_str,
    "totalFee" : total_fee,
    "envId": "laotudata-laotu",
    "functionName": "payCallBack",
    "tradeType" : trade_type,
    "openid" : open_id
  });
  return res;
}