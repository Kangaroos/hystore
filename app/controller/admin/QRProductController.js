"use strict"
var debug = require('debug')('hystore:admin:UsersController'),
  Promise = require('bluebird')

exports = module.exports = function(app) {
    var m = app.models;
    app.group('/admin/qr', function(router){
        router.get('/products', function* getProducts(){
            yield this.render('admin/products/index.dust');
        })
    })
};
