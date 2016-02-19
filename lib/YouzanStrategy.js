"use strict";
var oauth2 = require('passport-oauth2'),
  debug = require('debug')('heyu:sotre:YouzanStrategy'),
  url = require('url'),
  crypto = require('crypto'),
  JWT = require('koala-bear').Spices.JWT,
  Oauth2Strategy = oauth2.Strategy,
  AuthorizationError = oauth2.AuthorizationError,
  request = require('request');

class YouzanStrategy extends Oauth2Strategy {
  constructor(options, verify) {
    super(options, verify);
    this.name = options.name || "hystore-youzan";
    this.app = options.app;
  }
  authenticate(req, options) {
    if ( req.isAuthenticated() && (req.user.provider === "youzan")) {
      debug('already authenticated');
      return this.success(req.user);
    }
    var self = this;
    debug('user is not authenticated yet');
    options = options || {};
    var callbackURL = options.callbackURL || this._callbackURL;
    if (callbackURL) {
      var parsed = url.parse(callbackURL);
      if (!parsed.protocol) {
        // The callback URL is relative, resolve a fully qualified URL from the
        // URL of the originating request.
        callbackURL = url.resolve(utils.originalURL(req, {
          proxy: this._trustProxy
        }), callbackURL);
      }
    }

    function verified(err, user, profile) {
      if ( err ) { return self.error(err); }
      //if ( !user ) {
      //  var redirect = obj.redirect || "/users/info"
      //  var origUrl = 'http://'+ req.headers.host + '/wechat/action?toUrl=' + redirect;
      //
      //  return JWT.sign({origUrl:origUrl}).then(function(token) {
      //    return self.redirect(self.app._config.passport.loginUrl+"?t="+token);
      //  });
      //}
      console.log("login user alias", user);
      req.login(user);
      self.success(user, profile);
      if ( obj.redirect ) {
        console.log("redirect to ",obj.redirect);
        return self.redirect(obj.redirect);
      }
    }

    if (req.query && req.query.msg) {
      return this.error(new AuthorizationError('User didnt authorize ' + req.query.msg));
    }

    if (req.query && req.query.custom && req.query.custom == "youzan_redirect") {
      self._verify(req, req.query.open_id, req.query.fans_id, req.query, verified);
    } else {
      var params = this.authorizationParams(options);
      params.app_id = self._oauth2._clientId;
      params.redirect_url = callbackURL;
      params.timestamp = this._getDate();
      params.with_sign_keys = 1;
      params.custom = "youzan_redirect";
      var location = url.parse(self._oauth2._authorizeUrl);

      debug("callbackURL", callbackURL);
      var scope = options.scope || this._scope;
      if (scope) {
        if (Array.isArray(scope)) {
          scope = scope.join(this._scopeSeparator);
        }
        params.scope = scope;
      }

      params.sign = this._sign(self._oauth2._clientSecret, params);

      var redirect, query;

      redirect = redirect || req.url;
      if ( query ) {
        var queryStr = require('querystring').stringify(query);
        if(queryStr.length) {
          redirect = [redirect, require('querystring').stringify(query)].join("?");
        }
      }


      location.query = params;
      location = url.format(location);

      debug("redirecting it back to", redirect);

      self.redirect(location);
    }
  }

  _getDate() {
    var time = new Date();
    function format(str) {
      return str.toString().length === 1 ? '0' + str : str;
    }
    var month = time.getMonth() + 1;
    month = format(month);
    var day = time.getDate();
    day = format(day);
    var hour = time.getHours();
    hour = format(hour);
    var min = time.getMinutes();
    min = format(min);
    var sec = time.getSeconds();
    sec = format(sec);

    return time.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  }

  _hash(method, str) {
    if (method === 'md5') {
      var md5 = crypto.createHash('md5');
      md5.update(str);
      return md5.digest('hex').toLowerCase();
    } else {
      throw new Error('Not support hash method: ' + method);
    }
  }

  _sign(appSecret, params, method) {
    params = params || {};
    method = method || 'md5';

    var arr = [];
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        arr.push(key + params[key]);
      }
    }

    arr = arr.sort();

    return this._hash(method, appSecret + arr.join('') + appSecret);
  };

}

exports = module.exports = YouzanStrategy;