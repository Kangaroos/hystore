"use strict";
exports.name = "CreateTmpActivityPrizeVertex";

exports.up = function (db) {
  // @todo implementation
  return db.class.create('TmpActivityPrize', 'V')
  .then(function (c) {
    return Promise.all([
      c.property.create({name: 'type', type: 'String'}),
      c.property.create({name: 'min', type: 'Integer'}),
      c.property.create({name: 'max', type: 'Integer'}),
      c.property.create({name: 'prize', type: 'String'}),
      c.property.create({name: 'total', type: 'Integer'}),
      c.property.create({name: 'created_at', type: 'DateTime', default: 'sysdate()'}),
      c.property.create({name: 'updated_at', type: 'DateTime', default: 'sysdate()'})
    ]);
  })
};

exports.down = function (db) {
  // @todo implementation
  return db.class.drop('TmpActivityPrize');
};

