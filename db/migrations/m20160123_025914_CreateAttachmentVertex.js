"use strict";
exports.name = "CreateAttachmentVertex";

exports.up = function (db) {
  // @todo implementation
  return db.class.create('Attachment', 'V')
  .then(function (c) {
    return Promise.all([
      Promise.resolve(c),
      c.property.create({name: 'type', type: 'string', mandatory: true, regexp: 'image|file'}),
      c.property.create({name: 'meta', type: 'string', mandatory: true}),
      c.property.create({name: 'path', type: 'string', mandatory: true}),
      c.property.create({name: 'created_at', type: 'DateTime', mandatory: true}),
      c.property.create({name: 'updated_at', type: 'DateTime', mandatory: true})
    ]);
  })
};

exports.down = function (db) {
  // @todo implementation
  return db.class.drop('Attachment');
};

