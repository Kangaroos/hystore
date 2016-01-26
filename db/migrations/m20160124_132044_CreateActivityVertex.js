"use strict";
exports.name = "CreateActivityVertex";

exports.up = function (db) {
  // @todo implementation
  return db.class.create('Activity', 'V')
  .then(function (c) {
    return Promise.all([
      c.property.create({name: 'name', type: 'String', mandatory: true}),
      c.property.create({name: 'type', type: 'String'}),
      c.property.create({name: 'number', type: 'Integer'}),
      c.property.create({name: 'valid_date', type: 'DateTime'}),
      c.property.create({name: 'description', type: 'String'}),
      c.property.create({name: 'created_at', type: 'DateTime', default: 'sysdate()'}),
      c.property.create({name: 'updated_at', type: 'DateTime', default: 'sysdate()'})
    ]);
  })
};

exports.down = function (db) {
  // @todo implementation
  return db.class.drop('Activity');
};

