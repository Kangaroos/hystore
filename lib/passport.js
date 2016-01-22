"use strict";
var Strategy = require('passport-strategy'),
    debug = require('debug')('hystore-admin-user-passport');

class AdminAuthStrategy extends Strategy {
    constructor(verify, app){
        super();
        this._verify = verify;
        this.name = "hystore";
        this._app = app;
    }
    authenticate(req, options) {
        var self = this;
        debug(options);
        this._verify(options.alias, "hystore", options.password, function verified(err, user, info){
            debug("Eskygo Strategy Verified called",options);
            if ( err ) {
                debug("EskygoStrategy verified error", err);
                return self.error(err);
            }
            debug("Admin Auth Strategy Verified called2");
            if ( !user ) {
                debug("AdminAuthStrategy verified error: user is empty");
                req.session=null;
                return self.pass();
            }
            debug("Admin Auth Strategy Verified called3", user);
            user.alias = options.alias;
            debug("AdminAtuhStrategy completing:", user);
            self.success(user, info);
        });
    }
}

module.exports = exports = AdminAuthStrategy;