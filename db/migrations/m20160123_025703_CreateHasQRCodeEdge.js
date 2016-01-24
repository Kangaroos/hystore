"use strict";
exports.name = "CreateHasQRCodeEdge";

exports.up = function (db) {
  // @todo implementation
    return db.class.create('HasQRCode', 'E')
        .then(function(c){
            return Promise.all([
                c.property.create({name: 'in', type: 'Link', linkedClass: 'QRCode'}),
                c.property.create({name: 'out', type: 'Link', default: 'ProductQR'})
            ]);
        })
};

exports.down = function (db) {
  // @todo implementation
    return db.class.drop('HasQRCode');
};

