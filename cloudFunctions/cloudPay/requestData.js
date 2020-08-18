function requestData(
  appid,
  mch_id,
  nonce_str,
  sign,
  body,
  out_trade_no,
  total_fee,
  spbill_create_ip,
  notify_url,
  trade_type,
  openid
){
  let data = "<xml>"
  data += "<appid>"+appid+"</appid>"
  data += "<mch_id>"+mch_id+"</mch_id>"
  data += "<nonce_str>"+nonce_str+"</nonce_str>"
  data += "<sign>"+sign+"</sign>"
  data += "<body>"+body+"</body>"
  data += "<out_trade_no>"+out_trade_no+"</out_trade_no>"
  data += "<total_fee>"+total_fee+"</total_fee>"
  data += "<spbill_create_ip>"+spbill_create_ip+"</spbill_create_ip>"
  data += "<notify_url>"+notify_url+"</notify_url>"
  data += "<trade_type>"+trade_type+"</trade_type>"
  data += "<openid>"+openid+"</openid>"
  data += "</xml>"
  return data
}

module.exports = requestData