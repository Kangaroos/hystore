"use strict"

var debug = require('debug')('heyu:store:youzan-auth');
var Promise = require('bluebird');

exports = module.exports = function(app) {
  let User = app.models.User,
    UserAlias = app.models.UserAlias;

  return function(req, openid, fansid, profile, done) {
    let self = this , tokenObj = null;
    const provider = 'youzan';
    debug("replied with arguments", arguments);
    Promise.all([User.findByAlias(provider, openid, "openid")])
    .then(function(userAlias){
      debug('userAlias is ', userAlias);
      if ( userAlias[0] ) {
        debug('openid found',userAlias);
        return Promise.resolve(userAlias);
      } else {
        debug('openid not found, create open id alias');
        UserAlias.create({
          type: 'openid',
          alias: openid,
          provider: provider,
          data: profile
        }, function(err, alias) {
          debug('create alias is ', alias);
          return Promise.resolve(alias);
        });
      }
    })
    .then(function(userAlias) {
      done(null, userAlias, null);
    })
  }
};