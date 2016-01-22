"use strict"

var apiKey = "sk_test_aj9aHSfPiDO8mXzf5S9KWXvL"
var appId = "app_TKGOu5mzXX14qTqj"
var pingpp = require('pingpp')(apiKey);
var subject = "啫喱"
var Promise = require('bluebird')
class PingPPService {
  static createPayment(channel, amount, subj, body, clientIp, orderNo, extra) {
    extra = extra || {};
    return new Promise(function(res, rej){
      pingpp.charges.create({
        order_no:  orderNo,
        app:       { id: appId },
        channel:   channel,
        amount:    amount,
        client_ip: clientIp,
        currency:  "cny",
        subject:   subj,
        body:      body,
        extra:     extra
      }, function(err, charge) {
        if ( err ) {
          return rej(err)
        }
        res([charge.credentials, charge])
      });
    })
  }
  static createWechatQR(amount, clientIp, orderNo) {
    return PingPPService.createPayment("wx_pub_qr", amount, subject, "啫喱打印", clientIp, orderNo, {product_id: "someid"})
  }

  static createAliQR(amount, clientIp, orderNo) {
    return PingPPService.createPayment("alipay_qr", amount, subject, "啫喱打印", clientIp, orderNo, {})
  }
}

module.exports = exports = PingPPService;
