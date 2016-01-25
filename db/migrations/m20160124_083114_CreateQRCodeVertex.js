"use strict";
exports.name = "CreateQRCodeVertex";

exports.up = function (db) {
  // @todo implementation
    return db.class.create('QRCode', 'V')
        .then(function (c) {
            return Promise.all([
                c.property.create({name: 'batchId', type: 'String'}),
                c.property.create({name: 'serialNumber', type: 'String'}),
                c.property.create({name: 'code', type: 'String', mandatory: true}),
                c.property.create({name: 'baseUrl', type: 'String'}),
                c.property.create({name: 'type', type: 'String'}),
                c.property.create({name: 'description', type: 'String'}),
                c.property.create({name: 'created_at', type: 'DateTime', default: 'sysdate()'}),
                c.property.create({name: 'updated_at', type: 'DateTime', default: 'sysdate()'})
            ]);
        })
};

exports.down = function (db) {
  // @todo implementation
};

