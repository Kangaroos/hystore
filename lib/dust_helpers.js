module.exports = exports = function(dust, config){
	config = config || {};
	var cdn = config.cdn;
    var formatter = require('./formatter.js')
    var _ = require('lodash');
    dust.helpers.static = function(chunk, context, bodies, params){
        var resource = params.src;
        if ( resource[0] !== "/" ) { resource = "/"+resource; }
        if ( resource[0] === "/" ) {
            resource = resource.substr(1);
        }
        var staticVersion = config.staticVersion || "0";
        var extra = "&_v="+staticVersion.toString().trim();
        if ( resource.indexOf("?") < 0 ) {
        	extra = "?"+extra;
        }
        return chunk.write([cdn, resource, extra].join(''));
    }
    dust.helpers.arrContains = function(chunk, context, bodies, params) {
    	var arr = dust.helpers.tap(params.arr, chunk, context);
    	var value = dust.helpers.tap(params.value, chunk, context);
    	if ( !_.isArray(arr) ) {
    		return chunk.write("");
    	}
    	if ( arr.indexOf(value) > -1 ) {
    		return chunk.render(bodies.block, context);
    	}

    	return chunk.write("");
    };
    dust.helpers.money = function(chunk, context, bodies, params) {
    	var money = dust.helpers.tap(params.value, chunk, context);
    	var type = dust.helpers.tap(params.type, chunk, context) || "d";
    	type = type.toLowerCase();

    	money = new Number(money);

    	if ( "c" === type || "cents" === type ) {
    		money = money/100;
    	}

    	return chunk.write(formatter.money(money, 2));
    }
    dust.helpers.paginate = function(chunk, context, bodies, params) {

		var curr = parseInt(dust.helpers.tap(params.curr, chunk, context), 10) || 1,
		    total = parseInt(dust.helpers.tap(params.total, chunk, context), 10) || 1,
		    count = parseInt(dust.helpers.tap(params.count, chunk, context), 10) || 1,
		    query = dust.helpers.tap(params.query, chunk, context) || "";
		var max = Math.ceil(total/count);
		var page = curr;
		context.current().max = max;
		context.current().curr = curr*count;
		var qs = require('querystring');
		if ( typeof query === "string" ) {
			query = qs.parse(query);
		}

		if ( bodies.begin ) {
			query.p = 1;
			context.current()['query'] = qs.stringify(query);
			chunk = bodies.begin(chunk, context.push(context, bodies, params));
		}

		if ( bodies.prev && page-1 >= 1 && page <= max ) {
			query.p = curr-1;
			context.current()['query'] = qs.stringify(query);
			chunk = bodies.prev(chunk, context.push(context, bodies, params));
		}

		if ( bodies.next && page+1 <= max && page >= 1) {
			query.p = curr+1;
			context.current()['query'] = qs.stringify(query);
			chunk = bodies.next(chunk, context.push(context, bodies, params));
		}

		if ( bodies.end ) {
			query.p = max;
			context.current()['query'] = qs.stringify(query);
			chunk = bodies.end(chunk, context.push(context, bodies, params));
		}
		// while(from !== to) {
		//   chunk = bodies.block(chunk, context.push(from, from, len));
		//   from += increment;
		// }

		return chunk;
    }
}
