"use strict";

class UserAlias {
  constructor(s, orm) {
    s.string('provider', {required: true})
    s.string('alias', {required: true})
    s.string('type', {required: true})
    s.string('data')
    s.timestamps();
  }

  static findByUserIdAndType(userId, type, provider) {
    var self = this;
    var query = `select from (select expand(out('HasAlias')) from ${userId} ) where type="${type}"`;
    if ( provider ) {
      query += ` and provider="${provider}"`
    }
    return this._orientose()._db.query(query).map(function(alias){
      return Promise.resolve(self._omodel('UserAlias')._model._createDocument(alias));
    });
  }

  static findOrCreate(provider, type, alias, data) {
    var self = this;
    console.log("findOrCreate arguments: ", arguments);
    return self._orientose()._db.query("select * from UserAlias where provider=:provider and alias=:alias and type=:type", {
      params: {
        provider: provider,
        alias: alias,
        type: type
      }
    }).then(function (result) {
      console.log("find or create result", result);
      if (!result || result.length === 0) {
        self._orientose().db.create('VERTEX', 'UserAlias')
        .set({
          provider: provider,
          alias: alias,
          type: type,
          data: data
        })
        .one()
        .then(function (alias) {
          debug("creating user alias now" , alias);
          return Promise.resolve(self._model._createDocument(alias));
        }).catch(function (e) {
          debug('Failed creating user alias:', '\r\n', e.message, '\r\n', e.stack);
          throw e;
        });
      }
      return self._model._createDocument(result[0]);
    })
  }

  static createForUserId(userId, alias) {
    var query = this._orientose().db
    .let('alias', function(s) {
      return s.create('vertex', 'UserAlias').set(alias);
    });
    query = query.let('aliasedge',
      function(s) { return s.create('edge', 'HasAlias').from(userId).to('$alias')
      });
    return query.commit().return('$alias').one();
  }
}

module.exports = UserAlias;
