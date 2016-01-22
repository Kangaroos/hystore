"use strict"
var debug = require('debug')('hystore:admin:UsersController'),
  Promise = require('bluebird')

exports = module.exports = function(app) {
    var m = app.models;
    app.group('/admin/users', function(router){
        router.get('', function* getUsers(){
            var condition = [];
            var params = {};
            var page = this.query.p || 1, count = 20;
            if ( page < 1 ) {
                page = 1;
            }
            var offset = (page-1)*count;
            var limit = count;
            var filter = {};
            for ( var name in this.query ) {
                if ( name.startsWith('f.') ) {
                    if ( this.query[name].trim().length > 0 ) {
                        filter[name.substr(2)] = this.query[name];
                    }
                }
            }

            if(filter.mobile) {
                condition.push(`store_user_id.mobile like '%${filter.mobile}%'`);
            }
            var storeUsers = yield m.StoreUser.findByCondition(condition.join('AND'),offset, limit, params);
            var users = yield storeUsers.result.map(function(user) {
                return user;
            });
            yield this.render('admin/users/index.dust',{users: users, filter: filter, pagination: {page: 2, total: storeUsers.count, count: 10}});
        })
    })
}
