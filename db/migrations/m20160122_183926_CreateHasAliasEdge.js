"use strict";
exports.name = "CreateHasAliasEdge";

exports.up = function (db) {
  // @todo implementation
  return db.class.create('HasAlias', 'E')
  .then(function (c) {
    return Promise.all([
      c.property.create({name: 'in', type: 'Link', linkedClass: 'UserAlias'}),
      c.property.create({name: 'out', type: 'Link', default: 'User'})
    ]);
  })
};

exports.down = function (db) {
  // @todo implementation
  return db.class.drop('HasAlias');
};

