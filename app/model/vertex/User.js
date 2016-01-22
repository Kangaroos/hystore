"use strict";
var debug = require('debug')('hystore:models:StoreUser');

class StoreUser {
    constructor(s) {
        s.rid('store_user_id', {required: true})
        s.timestamps();
    }
    static findByStoreUserId(id) {
      return this.findOne({store_user_id: id});
    }

    static findByCondition(condition, offset, count, params, sort) {
        var self = this;
        count = count || 20;
        offset = offset || 0;
        params = params || {};
        if ( condition && condition.trim().length <= 0 ) {
            condition = undefined;
        }
        var query = self._orientose()._db.select()
            .from('StoreUser')
            .skip(offset)
            .limit(count)
            .addParams(params);
        if ( sort ) {
          query = query.order(sort)
        }
        if ( condition ) {
            query = query.where(condition);
        }
        return query.all()
            .map(function(user) {
                return self._omodel('StoreUser')._model._createDocument(user);
            }).then(function(users){
                var query = self._orientose()._db.select('count(@rid)')
                    .from('StoreUser');
                if ( condition ) {
                    query = query.where(condition);
                }
                return query
                    .scalar()
                    .then(function(count){
                        return {result: users, count: count}
                    })
            });
    }
}
module.exports = StoreUser;
