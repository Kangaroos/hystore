"use strict"
exports.seed = function(app) {
  console.log("arrived here");
  return new Promise(function(resolve, reject){
    console.log("running this");
    var fs = require('fs'),
      readline = require('readline');

    var rd = readline.createInterface({
      input: fs.createReadStream(app._basePath+'/db/seed/IpsPgBasic.sql'),
      output: process.stdout,
      terminal: false
    });

    var promises = [];
    rd.on('line', function(line) {
      console.log("executing this line");
      if ( line.trim() !== "" ) {
        console.log(line);
        promises.push(app._orm._db.query(line));
      }

    });
    rd.on('end', function(){
      Promise.all(promises).then(resolve).catch(reject);
    })

  })
}