"use strict";
exports.name = "CreateHasActivityPrizeEdge";

exports.up = function (db) {
  // @todo implementation
    return db.class.create('HasActivityPrize', 'E')
        .then(function(c){
            return Promise.all([
                c.property.create({name: 'in', type: 'Link', linkedClass: 'ActivityPrize'}),
                c.property.create({name: 'out', type: 'Link', default: 'Activity'})
            ]);
        })
};

exports.down = function (db) {
  // @todo implementation
    return db.class.drop('HasActivityPrize');
};

