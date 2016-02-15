"use strict";
exports.name = "CreateUserAliasVertex";

exports.up = function (db) {
  // @todo implementation
  return db.class.create('UserAlias', 'V')
  .then(function (c) {
    return Promise.all([
      c.property.create({name: 'type', type: 'String'}),
      c.property.create({name: 'alias', type: 'String'}),
      c.property.create({name: 'provider', type: 'String'}),
      c.property.create({name: 'data', type: 'String'}),
      c.property.create({name: 'created_at', type: 'DateTime', default: 'sysdate()'}),
      c.property.create({name: 'updated_at', type: 'DateTime', default: 'sysdate()'})
    ])
  }).then(function () {
    return db.index.create({name: 'UserAlias.provider_alias', type: 'unique', class: 'UserAlias', properties: ['provider', 'alias']})
  })
};

exports.down = function (db) {
  // @todo implementation
  return db.index.drop('UserAlias.provider_alias').then(function () {
    return db.class.drop('UserAlias');
  });
};

