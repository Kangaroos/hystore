"use strict";

const KoalaBear = require('koala-bear');
const fs = require('fs');

class HyStoreService extends KoalaBear {
    constructor() {
		super(module);
		var self = this;
	    self._app.use(function* (next){
			yield* next;
	    })
	}
	bootstrap() {
		this.use(require("./lib/AdminAuthStrategy"))
		this.use(function(){
			return {
				setup: function*(next) {
					yield* next
					var self = this;
					console.log("start listening");
					var cdn = self._config.cdn || "/static/";
					var staticVersion = fs.existsSync(".staticversion") ? fs.readFileSync(".staticversion") : 0;
					var dust = self._dust._dust;
					self._config.staticVersion = staticVersion;
					require('./lib/dust_helpers.js')(dust, self._config);
				}
			}
		})
	}
}

exports = module.exports = HyStoreService;
