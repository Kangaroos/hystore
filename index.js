"use strict";

const KoalaBear = require('koala-bear');
const fs = require('fs');
const readYaml = require('read-yaml');
const WechatAPI = require('co-wechat-api');

class HyStoreService extends KoalaBear {
    constructor() {
		super(module);
		var self = this;
		var config = readYaml.sync(require('path').resolve(self._basePath, "./config/wechat.yml"))[self._app.env];

		self.wechatApi = new WechatAPI(config.appId, config.appSecret);
	    self._app.use(function* (next){
			yield* next;
	    })
	}
	bootstrap() {
		this.use(require("./lib/AdminAuthStrategy"));
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
