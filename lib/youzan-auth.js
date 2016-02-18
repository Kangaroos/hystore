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
    User.findByAlias(provider, openid, "openid")
    .then(function(userAlias){
      debug('userAlias is ', userAlias);
      if ( userAlias ) {
        debug('openid found',userAlias);
        return done(null, userAlias, null);;
      } else {
        debug('openid not found, create open id alias');
        UserAlias.create({
          type: 'openid',
          alias: openid,
          provider: provider,
          data: JSON.stringify(profile)
        }, function(alias){
          debug('create alias is ', alias.toJSON({
            virtuals: true
          }));
          return done(null, alias.toJSON({
            virtuals: true
          })), null);
        });


      }
    })
    .then(function(userAlias) {
      done(null, userAlias, null);
    })
  }
};
