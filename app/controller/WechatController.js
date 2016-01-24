"use strict"
var debug = require('debug')('heyu:store:wechatController');

var Service = require('koala-bear').Spices.Service;
var readYaml = require('read-yaml');

//var WechatStrategy = require('../../lib/wechatStrategy');
var WechatReply = require('../../lib/wechat-reply');
//var WechatAuth = require('../../lib/wechat-auth');

exports = module.exports = function(app) {
    var config = readYaml.sync(require('path').resolve(app._basePath, "./config/wechat.yml"))[app._app.env];
    var domain = config.domain;
    var wechatReply = new WechatReply(config.token, domain);
    //    wechatAuth = new WechatAuth(app);



    //app.passport.use(new WechatStrategy({
    //    app: app,
    //    clientID: config.appId,
    //    clientSecret: config.appSecret,
    //    callbackURL: `${domain}/auth/wechat/callback`,
    //    scope: ['snsapi_base'],
    //    authorizationURL: "https://open.weixin.qq.com/connect/oauth2/authorize",
    //    tokenURL: "https://api.weixin.qq.com/sns/oauth2/access_token",
    //    defaultRedirect: "/users/signin"
    //}, wechatAuth));


    app.group('/wechat', function(router) {
        router.get('/receive', wechatReply);
        router.post('/receive', wechatReply);

        router.get('/qrscan',function * (next) {
            var self = this;

            var config = yield* app.wechatApi.getJsConfig({
                debug: false,
                jsApiList: [
                    'scanQRCode'
                ],
                url: domain + self.originalUrl
            });

            yield this.render('activity/QRScan.dust', {
                wxParam: config
            })
        });

        
        //router.get('/action', app.passport.authenticate('eskygo-wechat'), function*(next) {
        //    var urlParse = require("url").parse(this.query.toUrl, true);
        //    this.redirect(require("url").format(urlParse));
        //});
    });

    //app.get('/auth/wechat/callback', app.passport.authenticate('eskygo-wechat'));
};