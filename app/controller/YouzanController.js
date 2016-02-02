"use strict"
var debug = require('debug')('heyu:store:YouzanController');

var Service = require('koala-bear').Spices.Service;
var readYaml = require('read-yaml');

var YouzanStrategy = require('../../lib/YouzanStrategy');
var YouzanAuth = require('../../lib/youzan-auth');
var LotteryOods = require('../../lib/lottery_odds');

exports = module.exports = function (app) {
  var config = readYaml.sync(require('path').resolve(app._basePath, "./config/youzan.yml"))[app._app.env];
  var domain = config.domain,
    youzanAuth = new YouzanAuth(app);

  app.passport.use(new YouzanStrategy({
    app: app,
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: `${domain}/callback`,
    authorizationURL: "https://open.koudaitong.com/oauth/authorize",
    tokenURL: "https://open.koudaitong.com/oauth/token"
  }, youzanAuth));

  app.group('/activity', app.passport.authenticate('hystore-youzan'), function (router) {
    router.get('/:qrcode', function* activityQRCode() {
      var result = yield app.wechatApi.createTmpQRCode(100, 2592000);
      yield this.render('activity/bigrotarytable.dust', {qrurl: app.wechatApi.showQRCodeURL(result.ticket)});
    });

    router.post('/odds', function* scanqr() {
      var anlges = [0, 45, 90, 135, 180, 225, 270, 315];
      var prizearr = [{
        id: 1,
        min: 272,
        max: 313,
        prize: '恭喜获得200元优惠券,长按下方二维码关注公众号领取优惠!',
        v: 10
      }, {
        id: 2,
        min: 92,
        max: 133,
        prize: '恭喜获得100元优惠券,长按下方二维码关注公众号领取优惠!',
        v: 40
      }, {
        id: 3,
        min: 182,
        max: 223,
        prize: '恭喜获得20元优惠券,长按下方二维码关注公众号领取优惠!',
        v: 3600
      }, {
        id: 4,
        min: 137,
        max: 178,
        prize: '恭喜获得10元优惠券,长按下方二维码关注公众号领取优惠!',
        v: 6350
      }, {
        id: 5,
        min: 317,
        max: 358,
        prize: '恭喜获得5元优惠券,长按下方二维码关注公众号领取优惠!',
        v: 30000
      }, {
        id: 6,
        min: 2,
        max: 43,
        prize: '恭喜获得2元优惠券,长按下方二维码关注公众号领取优惠!',
        v: 60000
      }];

      //var countObject = {a:0,b:0,c:0,d:0,e:0,f:0,g:0,h:0};
      //for(var i=0;i<300000;i++) {
      //    var l = LotteryOods.odds(prizearr);
      //    if(l.id == 1 && countObject.a < prizearr[l.id - 1].v) {
      //        countObject.a +=1;
      //        console.log("1等奖", "=========", i);
      //    } else if(l.id == 2 && countObject.b < prizearr[l.id - 1].v) {
      //        countObject.b +=1;
      //    } else if(l.id == 3 && countObject.c < prizearr[l.id - 1].v) {
      //        countObject.c +=1;
      //    } else if(l.id == 4 && countObject.d < prizearr[l.id - 1].v) {
      //        countObject.d +=1;
      //    } else if(l.id == 5 && countObject.e < prizearr[l.id - 1].v) {
      //        countObject.e +=1;
      //    } else if(l.id == 6 && countObject.f < prizearr[l.id - 1].v) {
      //        countObject.f +=1;
      //    } else if(l.id == 7 && countObject.g < prizearr[l.id - 1].v) {
      //        countObject.g +=1;
      //    } else if(l.id == 8 && countObject.h < prizearr[l.id - 1].v) {
      //        countObject.h +=1;
      //    }
      //}
      //console.log(countObject);

      this.status = 200;
      this.body = LotteryOods.odds(prizearr);
    });
  });
}