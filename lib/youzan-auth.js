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
    })
  }
};