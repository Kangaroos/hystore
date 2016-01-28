"use strict"
exports.seed = function(app) {
  var m = app.models;
  var db = app._orm._db;
  var month = 0, year = 2014;
  var createBatches = [];
  for ( var year = 2014; year <= 2020; year++ ) {
    createBatches.push([`$y${year}`, `update Dian13Year SET year = "${year}", month={}, updated_at=sysdate(), created_at=sysdate() upsert return after @rid where year = "${year}"`])
    var months = [];
    for ( var month = 1; month <= 12; month++ ) {
      months.push(`"${month}": $y${year}m${month}`)
      createBatches.push([`$y${year}m${month}`, `update Dian13Month SET year="${year}", month="${month}" upsert return after @rid where month="${month}" and year="${year}"`])
      createBatches.push([`$y${year}m${month}add`, `update $y${year} PUT month = "${month}", first($y${year}m${month}.@rid)`])
    }
  }
  var query = db;
  for ( var i = 0; i < createBatches.length; i++ ) {
    query = query.let(createBatches[i][0], createBatches[i][1]);
  }
  return query.commit().return('$y2014').all().then(function(results){
    console.log(results, "FUCK YOU WHAT?!");
    return true;
  });
};