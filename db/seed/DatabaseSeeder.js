'use strict'

let debug = require('debug')('heyu:store:db:seed'),
  csv = require( 'csv' ),
  fs = require( 'fs' ),
  Promise = require('bluebird');

exports.seed = function ( app ) {

  let csvFile = app._basePath + '/db/seed/IpsParkingLot.csv';
  let parser = csv.parse( {delimiter: ',', relax: true} )

  let merServ = app.services( 'eskygo-merchant-service' )
  fs.createReadStream( csvFile ).pipe( parser )

  let dataCount = 0
  let dataArr = []

  let IpsParkingLot = app.models.IpsParkingLot

  return new Promise( function ( resolve, reject ) {
    parser.on( 'readable', function () {
      let row
      while (row = parser.read()) {
        if ( row !== '' && row[0] !== 'UID' ) {
          dataArr.push( row )
        }
      }
    } )
    parser.on( 'finish', function () {
      resolve( dataArr )
    } )
  } ).then( function ( dataArr ) {
    return merServ.post( '/merchants', {
      name: '百度地图资料'
    } , {} ).then( function ( res ) {                    // res only have merchant.id
      //console.log( res )
      if ( 200 !== res.status ) {
        throw 'merchant not created'
      }
      return res.body
    } )
  } ).then( function (mid) {
    console.log( `mid : ${mid}` )
    return Promise.all(dataArr.map( function ( element ) {
      return merServ.post(`/merchants/${mid}/shops`, {
        name: element[ 1 ],
        address: element[ 2 ],
        lat: element[ 4 ].split( ',' )[ 0 ],
        lng: element[ 4 ].split( ',' )[ 1 ]
      } , {} ).then( function ( res ) {
        // console.log( res )
        if ( 200 !== res.status ) {
          throw 'merchant shop not created'
        }
        return res.body  // res only have merchantShop.id
      } ).catch (function (e) {
        throw e
      } )
    } ) )
  } ).then( function (shops) {
    console.log( `inside shops : ${shops}` )
    console.log( `shops len : ${shops.length}, shops[0]=${ shops[ 0 ]}` )

    return Promise.all( dataArr.map( function ( element, index ) {
      let sid = '#' + shops[ index ]
      // console.log(`sid : ${sid}`)
      let body = {
        active: true,
        capacity: 0,
        available: 0,
        name: element[ 1 ].trim(),
        description: '',
        lat: element[ 4 ].split( ',' )[ 0 ],
        lng: element[ 4 ].split( ',' )[ 1 ],
        eskygo_merchant_shop: sid,
        settings: {
          coupon: false,
          autopay: false,
          book: false,
          max_book: 0
        }
      }
      return IpsParkingLot.createForIpsParkingLot( body )
    } ) )
  } ).then( function () {
    // update the init db data
    let lat = 31.858606
    let condition = `lat = ${lat}`

    return IpsParkingLot.findByCondition( condition )
  } ).then( function ( obj ) {
    let db = app._orm._db
    debug( `obj : ${JSON.stringify( obj )}` )
    let promises = []
    let sqls = []
    obj[ 'result' ].map( function ( parkingLot ) {
      let rid = parkingLot.rid
      let newParkingLot = parkingLot
      newParkingLot.settings = `{autopay:true, coupon:true, book:true, max_book:10}`

      let sql = `Update ${rid} set settings = {"autopay":true, "coupon":true, "book":true, "max_book":6}, available = 200, capacity = 400`
      promises.push( new Promise( function ( resolve ) {
        resolve( db.query( sql ) )
      } ) )
      sqls.push( `Update ${rid} set desc_price = '1. 15 分钟以内：免费\n2. 2 小时以内( 含 )：5 元\n3. 2 - 12 小时( 含 )：30 元\n4. 12 - 14 小时( 含 )：35 元\n5. 14 - 24 小时( 含 )：60 元\n'` )
    } )
    console.log( '\n\n*** IMPORTANT ***' )
    console.log( `Cause by Orientojs occur Lexical error, please following sql manually : ` )
    sqls.map( function ( s ) {
      console.log( s )
    } )

    return Promise.all( promises )
  } ).catch( function (e) {
    console.log( e )
  } )

  console.log( 'end of pakringlot parsing' )
}