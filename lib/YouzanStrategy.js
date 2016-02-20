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
    console.log("request user is ", req.user);
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

    debug("callbackURL", callbackURL);

    if (req.query && req.query.msg) {
      return this.error(new AuthorizationError('User didnt authorize ' + req.query.msg));
    }

    if (req.query && req.query.fans_id && req.query.custom) {
      debug('youzan redirected back with', req.query);

      JWT.verify(req.query.custom).then(function(obj) {
        function verified(err, user, profile) {
          if ( err ) { return self.error(err); }
          self.success(user);
          if ( obj.redirect ) {
            debug("redirect to", obj.redirect);
            self.redirect(obj.redirect);
          }
          //req.login(user,function(err) {
          //
          //});
        }

        self._verify(req, req.query.open_id, req.query.fans_id, req.query, verified);
      });

    } else {
      var params = this.authorizationParams(options);
      params.app_id = self._oauth2._clientId;
      params.redirect_url = callbackURL;
      params.timestamp = this._getDate();
      params.with_sign_keys = 1;

      var redirect, query;

      if ( req.query ) {
        query = req.query;
        if ( query && query.toUrl ) {
          redirect = query.toUrl;
          delete query.toUrl;
        }
      }

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
        var location = url.parse(self._oauth2._authorizeUrl);
        params.custom = token;

        var scope = options.scope || self._scope;
        if (scope) {
          if (Array.isArray(scope)) {
            scope = scope.join(self._scopeSeparator);
          }
          params.scope = scope;
        }

        params.sign = self._sign(self._oauth2._clientSecret, params);

        location.query = params;
        location = url.format(location);

        debug("redirecting to: ", location);
        self.redirect(location);
      }).catch(self.error);


      //self.redirect(location);
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