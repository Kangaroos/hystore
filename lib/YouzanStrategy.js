"use strict";
var oauth2 = require('passport-oauth2'),
  debug = require('debug')('heyu:sotre:YouzanStrategy'),
  url = require('url'),
  JWT = require('koala-bear').Spices.JWT,
  Oauth2Strategy = oauth2.Strategy,
  AuthorizationError = oauth2.AuthorizationError,
  request = require('request');

class YouzanStrategy extends Oauth2Strategy {
  constructor(options, verify) {
    super(options, verify);
    console.log("================= youzan strategy");
    this.name = options.name || "hystore-youzan";
    this.app = options.app;
  }
  authenticate(req, options) {
    console.log("==================== authenticate");
    if ( req.isAuthenticated() && (req.user.provider.type === "youzan")) {
      debug('already authenticated');
      // req.user.provider = "wechat";
      //req.user.provider = req.user.provider.type;
      return this.success(req.user);
    }
    debug('user is not authenticated yet');
    options = options || {};
    var self = this;
    var callbackURL = options.callbackURL || this._callbackURL;
    console.log("1",callbackURL);
    if (callbackURL) {
      var parsed = url.parse(callbackURL);
      console.log("2",parsed)
      if (!parsed.protocol) {
        // The callback URL is relative, resolve a fully qualified URL from the
        // URL of the originating request.
        callbackURL = url.resolve(utils.originalURL(req, {
          proxy: this._trustProxy
        }), callbackURL);
        console.log("3",callbackURL);
      }
    }

    console.log("4", req.query);
    if (req.query && (req.query.state && !req.query.code)) {
      return this.error(new AuthorizationError('User didnt authorize'));
    }

    if (req.query && req.query.code && req.query.state) {
      debug('youzan redirected back with', req.query);
      //var code = req.query.code;
      //var params = this.tokenParams(options);
      //params.grant_type = 'authorization_code';
      //params.redirect_uri = callbackURL;
      //var accessTokenReqUrl = `${self._oauth2._accessTokenUrl}?appid=${self._oauth2._clientId}&secret=${self._oauth2._clientSecret}&code=${code}&grant_type=authorization_code`;
      //debug(accessTokenReqUrl);
      //JWT.verify(req.query.state).then(function(obj) {
      //  debug('state verified:', obj);
      //  function verified(err, user, info) {
      //    if ( err ) { return self.error(err); }
      //    if ( !user ) {
      //      var redirect = obj.redirect || options.defaultRedirect
      //      var origUrl = 'http://'+ req.headers.host + '/wechat/action?toUrl=' + redirect;
      //
      //      return JWT.sign({origUrl:origUrl}).then(function(token) {
      //        return self.redirect(self.app._config.passport.loginUrl+"?t="+token);
      //      });
      //    }
      //    self.success(user, info);
      //    if ( obj.redirect ) {
      //      return self.redirect(obj.redirect);
      //    }
      //  }
      //  request
      //  .get(accessTokenReqUrl, function(err, response, body) {
      //    if ( err ) {
      //      debug('token req failed:', err);
      //      return self.error(err);
      //    }
      //    body = JSON.parse(body);
      //    var accessToken = body.access_token;
      //    var refreshToken = body.refresh_token;
      //    var openid = body.openid;
      //    debug("weixin access token body", body);
      //    request.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}`, function(err, res, profile){
      //      if ( err ) {
      //        debug('user profile req failed:', err);
      //        return self.error(err);
      //      }
      //      var jsprofile = JSON.parse(profile);
      //      debug("user profile from weixin", jsprofile);
      //
      //      var unionid = jsprofile.unionid;
      //      // if ( !profile.unionid ) {
      //      //     profile.unionid = profile.openid;
      //      // }
      //
      //      self._verify(req, openid, unionid, profile, accessToken, verified);
      //    })
      //  })
      //});
    } else {
      var params = this.authorizationParams(options);
      params.response_type = 'code';
      params.redirect_uri = callbackURL;
      debug("callbackURL", callbackURL);
      var scope = options.scope || this._scope;
      if (scope) {
        if (Array.isArray(scope)) {
          scope = scope.join(this._scopeSeparator);
        }
        params.scope = scope;
      }
      var redirect, query;

      redirect = redirect || req.url;
      if ( query ) {
        var queryStr = require('querystring').stringify(query);
        if(queryStr.length) {
          redirect = [redirect, require('querystring').stringify(query)].join("?");
        }
      }

      debug("redirecting it back to", redirect);
      JWT.sign({
        redirect: redirect
      }).then(function(token) {
        params.state = token;
        var location = self._oauth2.getAuthorizeUrl(params)+"#youzan_redirect";
        debug("redirecting to: ", location);
        self.redirect(location);
      }).catch(this.error);
    }
  }
}

exports = module.exports = YouzanStrategy;