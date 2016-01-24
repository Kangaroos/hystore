"use strict";
exports.name = "CreateUserVertex";

exports.up = function (db) {
  // @todo implementation
    return db.class.create('User', 'V')
        .then(function (c) {
            return Promise.all([
                c.property.create({name: 'name', type: 'String', mandatory: true}),
                c.property.create({name: 'password', type: 'String'}),
                c.property.create({name: 'encrypted_password', type: 'String'}),
                c.property.create({name: 'identityType', type: 'String'}),
                c.property.create({name: 'identityNo', type: 'String'}),
                c.property.create({name: 'mobile', type: 'String'}),
                c.property.create({name: 'email', type: 'String'}),
                c.property.create({name: 'age', type: 'Short', min: 0}),
                c.property.create({name: 'sex', type: 'String', regexp: '[M|F]'}),
                c.property.create({name: 'status', type: 'String'}),
                c.property.create({name: 'created_at', type: 'DateTime', default: 'sysdate()'}),
                c.property.create({name: 'updated_at', type: 'DateTime', default: 'sysdate()'})
            ]);
        })
};

exports.down = function (db) {
  // @todo implementation
    return db.class.drop('User');
};

