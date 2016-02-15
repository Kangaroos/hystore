"use strict";
var debug = require('debug')('hystore:models:User');

class User {
    constructor(s) {
        s.string('name', {
            required: true
        });
        s.string('password');
        s.string('encrypted_password');
        s.string('status');
        s.string('identityType');
        s.string('identityNo');
        s.string('mobile');
        s.string('email');
        s.string('sex');
        s.integer('age');
        s.timestamps();
    }

    static findByAlias(provider, alias, type) {
        var self = this;
        // NOTE: in some corner cases, the UserAlias might have the specified vertex existing without having an edge between the user and the alias
        return this._orientose()._db.query("select expand(in('HasAlias')) from UserAlias where provider=:provider and alias=:alias and type=:type", {
            params: {
                provider: provider,
                alias: alias,
                type: type
            }
        }).then(function (result) {
            if (!result || result.length === 0) {
                return null;
            }
            return self._model._createDocument(result[0]);
        })
    }

    static createWithAliasAndProvider(user, alias) {
        var self = this;
        return this._app()._crypter.encrypt(user.password)
        .then(function (epass) {
            user.encrypted_password = epass;
            user.password = self._app()._crypter.hash(user.password);
            var query = self._orientose().db
            .let('store_user', function (s) {
                user.created_at = Date.now();
                user.updated_at = Date.now();
                return s.create('vertex', 'User')
                .set(user)
            });
            if (alias) {
                query = query.let('alias', function (s) {
                    return s.create('vertex', 'UserAlias').set(alias);
                });
                query = query.let('aliasedge', function (s) {
                    return s.create('edge', 'HasAlias').from('$store_user').to('$alias')
                })
            }
            debug("creating");
            return query.commit().return('$store_user').one().then(function (user) {
                debug("creating user now");
                return Promise.resolve(self._model._createDocument(user));
            }).catch(function (e) {
                debug('Failed creating user:', '\r\n', e.message, '\r\n', e.stack);
                throw e;
            })
        })
    }

    roles() {
        var self = this;
        return this._orientose()._db.query(`select expand(out('IsA')) from ${this._id}`).map(function (role) {
            return Promise.resolve(self._omodel('Role')._model._createDocument(role));
        })
    }

    addRole(role) {
        console.log("begin addRole", role);
        var IsA = this._omodel('IsA');
        var isa = new IsA();
        isa.from(this['@rid']);
        isa.to(role['@rid']);
        return isa.save();
    }

    aliases() {
        var self = this;
        return this._orientose()._db.query(`select expand(out('HasAlias')) from ${self._id}`).map(function (useralias) {
            return Promise.resolve(self._omodel('UserAlias')._model._createDocument(useralias));
        })
    }

    static findByCondition(condition, offset, count, params, sort) {
        var self = this;
        count = count || 20;
        offset = offset || 0;
        params = params || {};
        if ( condition && condition.trim().length <= 0 ) {
            condition = undefined;
        }
        var query = self._orientose()._db.select()
        .from('User')
        .skip(offset)
        .limit(count)
        .addParams(params);
        if ( sort ) {
            query = query.order(sort)
        }
        if ( condition ) {
            query = query.where(condition);
        }
        return query.all()
        .map(function(user) {
            return self._omodel('User')._model._createDocument(user);
        }).then(function(users){
            var query = self._orientose()._db.select('count(@rid)')
            .from('User');
            if ( condition ) {
                query = query.where(condition);
            }
            return query
            .scalar()
            .then(function(count){
                return {result: users, count: count}
            })
        });
    }
}
module.exports = User;
