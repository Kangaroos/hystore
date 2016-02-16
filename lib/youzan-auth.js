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
        var alias = UserAlias.create({
          type: 'openid',
          alias: openid,
          provider: provider,
          data: JSON.stringify(profile)
        });
        console.log(alias);
        console.log(alias.exec());
        console.log(alias.then());
        console.log(alias.then());
        debug('create alias is ', alias.toJSON({
          virtuals: true
        }));
        return Promise.resolve(alias.toJSON({
          virtuals: true
        }));
      }
    })
    .then(function(userAlias) {
      done(null, userAlias, null);
    })
  }
};