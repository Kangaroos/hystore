"use strict";

class UserAlias {
  constructor(s, orm) {
    s.string('provider', {required: true})
    s.string('alias', {required: true})
    s.string('type', {required: true})
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
