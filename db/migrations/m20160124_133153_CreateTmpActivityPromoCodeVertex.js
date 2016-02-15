"use strict";
exports.name = "CreateTmpActivityPromoCodeVertex";

exports.up = function (db) {
  // @todo implementation
  return db.class.create('TmpActivityPromoCode', 'V')
  .then(function (c) {
    return Promise.all([
      c.property.create({name: 'serial_number', type: 'String'}),
      c.property.create({name: 'code', type: 'String'}),
      c.property.create({name: 'value', type: 'Integer'}),
      c.property.create({name: 'status', type: 'String'}),
      c.property.create({name: 'created_at', type: 'DateTime', default: 'sysdate()'}),
      c.property.create({name: 'updated_at', type: 'DateTime', default: 'sysdate()'})
    ]);
  })
};

exports.down = function (db) {
  // @todo implementation
  return db.class.drop('TmpActivityPromoCode');
};

