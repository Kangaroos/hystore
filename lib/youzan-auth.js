"use strict";

var debug = require('debug')('heyu:store:youzan-auth');

exports = module.exports = function(app) {
  let User = app.models.User,
    UserAlias = app.models.UserAlias;


  return function(req, openid, fansid, profile, done) {
    var self = this , tokenObj = null;
    const provider = 'youzan';
    debug("replied with arguments", arguments);
    let userAlias = yield User.findByAlias(provider, openid, "openid");
    if (userAlias.length === 0) {
      console.log("userAlias undefined");
    } else {

    }


  };
};