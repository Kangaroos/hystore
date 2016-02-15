"use strict";
exports.name = "CreateHasAttachmentEdge";

exports.up = function (db) {
  // @todo implementation
  return db.class.create('HasAttachment', 'E')
  .then(function (c) {
    return Promise.all([
      Promise.resolve(c),
      c.property.create({name: 'in', type: 'Link', linkedClass: 'Attachment'}),
      c.property.create({name: 'out', type: 'Link'})
    ]);
  }).spread(function (c) {
    return db.index.create({name: 'HasAttachment.uniqueness', type: 'unique', class: 'HasAttachment', properties: ['in', 'out']})
  })
};

exports.down = function (db) {
  // @todo implementation
  return db.index.drop('HasAttachment.uniqueness').then(function () {
    return db.class.drop('HasAttachment');
  });
};

