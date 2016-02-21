"use strict";
var debug = require('debug')('hystore:models:Product');

class Product {
    constructor(s) {
        s.string('name', {
            required: true
        });
        s.string('spec');
        s.string('origin');
        s.string('howEat');
        s.string('tips');
        s.string('tag');
        s.string('description');
        s.timestamps();
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
        .from('Product')
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
        .map(function(product) {
            return self._omodel('Product')._model._createDocument(product);
        }).then(function(products){
            var query = self._orientose()._db.select('count(@rid)')
            .from('Product');
            if ( condition ) {
                query = query.where(condition);
            }
            return query
            .scalar()
            .then(function(count){
                return {result: products, count: count}
            })
        });
    }
}
module.exports = Product;
