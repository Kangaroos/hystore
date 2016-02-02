"use strict";

var debug = require('debug')('heyu:store:youzan-auth');

exports = module.exports = function(app) {
  return function(req, openid, unionid, profile, token, done) {
    var self = this , tokenObj = null;
    const provider = 'youzan';
    debug("replied with arguments", arguments);
    // logic:
    // first retrieve openid, if openid is not found
    // then retrieve with unionid(if exist)
    // unionid shall be used for merger later, for now, it shall only be used for recording and retrieval
    //

  };
};