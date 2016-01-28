"use strict"

var debug = require('debug')('heyu:store:wechat-reply');
var wechat = require('co-wechat');

exports = module.exports = function(token, domain) {

    return wechat(token).middleware(function*() {
        console.log(2123123);
        var message = this.weixin;
        console.log(message);
        if (message.MsgType === 'event') {
            console.log(message);
            if (message.Event.toLowerCase() === "subscribe") {
                // 用户关注时自动回复
                this.body = {
                    content: '感谢关注禾煜南北货！南北货也可以很新鲜，在这里你可以挑选让你称心如意的优质南北货~[微笑]',
                    type: 'text'
                };
                // return this.status = 200;
            }
            if (message.Event.toLowerCase() === 'scan' || message.Event.toLowerCase() === "subscribe") {

                //用户通过QR Code 扫描关注
                this.body = {
                    content: '欢迎扫码关注！\n点此扫描袋内二维码领取优惠：\n<a href="' + domain + '/wechat/qrscan">马上扫描领取！</a>',
                    type: 'text'
                };
                // return this.status = 200;

            }

            if(message.Event.toLowerCase() === 'location') {
                
            }

        } else if (message.MsgType === 'text') {
            /*  假如服务器无法保证在五秒内处理并回复，必须直接回复空串
             （ 是指回复一个空字符串，而不是一个XML结构体中content字段的内容为空，请切勿误解 ) */
            this.body = '欢迎光临禾煜旗舰店';
            // return this.stauts;
        }
    });
};