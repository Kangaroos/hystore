"use strict";
exports.name = "CreateProductQRVertex";

exports.up = function (db) {
  // @todo implementation
    return db.class.create('ProductQR', 'V')
        .then(function (c) {
            return Promise.all([
                c.property.create({name: 'serialNumber', type: 'String', mandatory: true}),
                c.property.create({name: 'spec', type: 'String'}),
                c.property.create({name: 'origin', type: 'String'}),
                c.property.create({name: 'howEat', type: 'String'}),
                c.property.create({name: 'tips', type: 'String'}),
                c.property.create({name: 'tag', type: 'String'}),
                c.property.create({name: 'description', type: 'String'}),
                c.property.create({name: 'created_at', type: 'DateTime', default: 'sysdate()'}),
                c.property.create({name: 'updated_at', type: 'DateTime', default: 'sysdate()'})
            ]);
        })
};

exports.down = function (db) {
  // @todo implementation
};

