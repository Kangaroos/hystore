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
                    content: '123123',
                    type: 'text'
                };
                // return this.status = 200;
            }
            if (message.Event.toLowerCase() === 'scan' || message.Event.toLowerCase() === "subscribe") {

                console.log(message.FromUserName);
                //用户通过QR Code 扫描关注
                this.body = {
                    content: '123123123',
                    type: 'text'
                };
                // return this.status = 200;

            }
        } else if (message.MsgType === 'text') {
            /*  假如服务器无法保证在五秒内处理并回复，必须直接回复空串
             （ 是指回复一个空字符串，而不是一个XML结构体中content字段的内容为空，请切勿误解 ) */
            this.body = '434343';
            // return this.stauts;
        }
    });
};