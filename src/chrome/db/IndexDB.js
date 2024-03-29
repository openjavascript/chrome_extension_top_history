import BaseDB from './BaseDB.js'
import Dexie from '../utils/dexie.js'
import md5 from '../utils/md5.js'
import config from '../config.js'
import IDBExportImport from '../utils/indexeddb-export-import.js'
import moment from '../utils/moment.js'
import saveAs from '../utils/FileSaver.js'

export default class IndexDB extends BaseDB {
    constructor( dbType ){
        super( 'IndexedDB' )
    }

    init(){
        console.log( 'method from IndexDB' )
    }

    isLogin() {
        return false;
    }

    topList( limit = 50 ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            resolve( db[config.dbDataTableName].orderBy('updateDate').reverse().limit( limit  ).toArray() );
        });
    }

    fullList( page = 1, size = 50, id ){
        let offset = ( page - 1 ) * size;

        console.log( 'fullList', page, size, id );

        if( id ){
            return new Promise( ( resolve, reject ) => {
                let db = this.getDB();
                db[config.dbDataTableName].where('id').equals( parseInt( id ) ).toArray().then( ( data )=>{
                    console.log( data, id );
                    
                    resolve( { data: data, total: data.length }
                    );
                });
            });

        }

        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db[config.dbDataTableName].count(( count )=>{
                db[config.dbDataTableName].orderBy('updateDate').reverse().offset( offset ).limit( size ).toArray().then( ( data )=>{
                    console.log( 'list data', data );
                    resolve( 
                        { data: data, total: count }
                    );
                });
            });
        });
    }

    search( text ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            //resolve( db[config.dbDataTableName].orderBy('updateDate').reverse().limit( limit  ).toArray() );

            let r = [];

            db[config.dbDataTableName]
                .orderBy('updateDate')
                .each( ( note )=>{
                    //console.log( notes );
                    let ltext = text.toLowerCase();
                    if( 
                        ( note.note && (note.note).toLowerCase().indexOf( ltext ) > -1 )
                        || ( note.siteTitle && (note.siteTitle ).toLowerCase().indexOf( ltext ) > -1 )
                    ){
                        r.unshift( note );
                    }
                }).then( ()=>{
                    resolve( r );
                });;

            //resolve( [] );
        });
    }

    getDB(){
        let db = new Dexie( config.dbName );
        db.version(1).stores({
            [`${config.dbDataTableName}`]: "++id,note,siteUrl,siteTitle,tags,remark,width,height,md5,createDate,updateDate"
        });
        return db;
    }

    deleteDB(){
        Dexie.delete( config.dbName )
    }

    total(){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db[config.dbDataTableName].count().then( ( total  )=>{
                resolve( total )
            } ).catch( ( err )=>{
                reject( err )
            } )
        })
    }

    deleteItem( id, md5 ) {
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db[config.dbDataTableName]
                .where( 'id' )
                .equals( id )
                .delete()
                .then( ( data )=>{
                    console.log( 'delete', id, data, md5 );
                    resolve( id );
                })
                .catch( (err)=>{
                    reject( err, id );
                });
        });
    }

    add( json = {} ) {
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            let dateStr = Date.now(); 
            let dataItem =  Object.assign( {
                note: '' 
                , md5: '' 
                , siteUrl: '' 
                , siteTitle: ''
                , tags: ''
                , remark: ''
                , width: 100
                , height: 100
                , createDate: dateStr
                , updateDate: dateStr
                }
                , json 
            );
            console.log( 'data added:', dataItem );
            db[config.dbDataTableName].add( dataItem ).then(()=>{
                resolve( dataItem )
            }).catch(function (e) {
                reject( e )
            });
        });
    }

    batchAdd( data ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();

            db[config.dbDataTableName].bulkAdd( data ).then(function() {
                resolve( data )
            }).catch(function (e) {
                reject( e )
            });
        });
    }

    batchDelete( key, list ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db[config.dbDataTableName].where( key ).anyOf( list ).delete().then( ( data )=>{
                resolve();
            });
        });
    }

    batchPush( key, list ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();

            console.log( 'x1' );
            db[config.dbDataTableName].where( key ).anyOf( list ).toArray().then( ( data )=>{
                resolve();
            }).catch(function (e) {
                reject( e )
            });
        });

    }

    checkRefresh(){
        if( this.refresh === 3 ){
            location.reload();
        }
    }

    logout(){
		localStorage.removeItem( 'token' );
		localStorage.removeItem( 'md5' );
		localStorage.removeItem( 'username' );
		localStorage.removeItem( 'nickname' );
		localStorage.removeItem( 'email' );
		localStorage.removeItem( 'logintype' );
		localStorage.removeItem( 'uid' );

        location.reload();
    }

    dataGenerator( limit = 10000 ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            let listData = [];

            for( let i = 0; i < limit; i++ ){
                let tmpNote = 'note' + i;
                let dateStr = ( Date.now() + i )
                listData.push( {
                    note: tmpNote
                    , md5: md5( tmpNote )
                    , siteUrl: 'index.html'
                    , siteTitle: '-'
                    , tags: ''
                    , remark: ''
                    , width: "100"
                    , height: "100"
                    , createDate: dateStr
                    , updateDate: dateStr
                } )
            }

            db[config.dbDataTableName].bulkAdd( listData).then(function() {
                console.log( 'dataGenerator successfully', limit )
                resolve( listData )
            }).catch(function (e) {
                console.error("dataGenerator Error: " + (e.stack || e));
                reject( e )
            });
        });
    }

    clearData(){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db.open().then( ()=>{
                var idb_db = db.backendDB();
                IDBExportImport.clearDatabase(idb_db, function(err) {
                    if (!err){
                        resolve();
                    }else{
                        reject( err  );
                    }
                });
            } )
        }) ;
    }

    fixmd5Data (){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            let r = [];
            db.transaction( 'rw', db[config.dbDataTableName], () => {
               db[config.dbDataTableName].toCollection().modify( ( data )=>{
                    data.md5 = md5( [ data.siteTitle + data.note ].join( ' - ' ) )
                    r.push( data );
                }).then( ()=>{
                    resolve( r );
                });;
            });
        });
    }

    fixdateData (){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            let r = [];
            db.transaction( 'rw', db[config.dbDataTableName], () => {
               db[config.dbDataTableName].toCollection().modify( ( data )=>{
                    data.createDate = parseInt( data.createDate );
                    data.updateDate = parseInt( data.updateDate );
                    r.push( data );
                }).then( ()=>{
                    resolve( r );
                });;
            });
        });
    }


    backup(){
        return new Promise( (resolve, reject) => {
            let db = this.getDB();
            db.open().then( ()=>{
                var idb_db = db.backendDB();
                IDBExportImport.exportToJsonString(idb_db, function(err, jsonString) {
                    if(err){
                        console.error(err);
                        reject( err )
                    } else {
                        var blob = new Blob([jsonString], {type: "text/plain;charset=utf-8"});
                        saveAs(blob, `${config.dbName}_${moment().format('YYYYMMDD')}.json`);
                        resolve( jsonString );
                    }
                });
            } )
        });
    }
    restore( result, cleanData  ){
        return new Promise( ( resolve, reject ) => {

            let db = this.getDB();
            db.open().then( ()=>{
                var idb_db = db.backendDB();
                if( cleanData ){
                    IDBExportImport.clearDatabase(idb_db, function(err) {
                        IDBExportImport.importFromJsonString(idb_db, result, function(err) {
                            if (err){
                                console.error( err );
                                reject( err  );
                            }else{
                                resolve( result );
                            }
                        });
                    });
                }else{
                    let importData = { src: JSON.parse( result ), map: {} };
                    let newData = [];

                    if( importData.src && importData.src.notes && importData.src.notes.length ){

                        db[config.dbDataTableName].toArray().then( ( data )=>{
                            data.map( ( sitem, six ) => {
                                importData.map[ sitem.md5 ] = sitem;
                            });

                            importData.src.notes.map( ( item, ix ) => {
                                delete item.id;
                                if( !(item.md5 in importData.map) ){
                                    newData.push( item );
                                    console.log( 'newItem:', item );
                                }
                            });

                            if( !newData.length ){
                                resolve( newData );
                                return;
                            }

                            db[config.dbDataTableName].bulkAdd( newData ).then(function() {
                                resolve( newData )
                            }).catch(function (e) {
                                console.error("resolve Error: " + (e.stack || e));
                                reject( e )
                            });


                        });

                    }
                }
                /*
                */
            } )
        } )
    }
}

