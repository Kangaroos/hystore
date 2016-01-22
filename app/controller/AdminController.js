"use strict"
var debug = require('debug')('hystore:admin:AdminController'),
    Promise = require('bluebird');

exports = module.exports = function(app) {
    var m = app.models;
    app.group('/admin', function(router){
        function* welcome(){
            yield this.render('admin/welcome.dust');
        }
        router.get('',  welcome);
        router.get('/', welcome);

        router.get('/login', function* login(){
            yield this.render('admin/login.dust');
        })
    })
}
