console.log( 'background', Date.now() );

import config from './config.js';
import db from './db.js';
import md5 from './utils/md5.js'

main();

function addNote(info, tab) {

    let data = {
		note: `info.selectionText`
		, siteUrl: tab.url
		, siteTitle: tab.title
		, md5: ''
		, width: tab.width.toString()
		, height: tab.height.toString()
	}

	return new Promise( ( resolve, reject ) => {


		//chrome.permissions.request({
			//permissions: ['tabs'],
			//origins: [
				//"http://*/"
				//, "https://*/"
				//, "ftp://*/"
                //, "file:///*/"
			//]
		//}, function(granted) {
			//// The callback argument will be true if the user granted the permissions.
			//if (granted) {
				//chrome.tabs.executeScript( {
					//code: "window.getSelection().toString();"
				//}, function(selection) {
					//data.note = selection[0];
					//data.md5 = md5( [ data.siteTitle + data.note ].join( ' - ' ) )

					//db.add( data ).then( ( )=> {
						//resolve( data );
					//}).catch( (err) => {
						//reject( err );
					//});
				//});
			//} else {
                //data.note = info.selectionText;
                //data.md5 = md5( [ data.siteTitle + data.note ].join( ' - ' ) )
				//data.nopre = true;
                
                //db.add( data ).then( ( )=> {
                    //resolve( data );
                //}).catch( (err) => {
                    //reject( err );
                //});
			//}
		/*});*/
	});
}

let copyNoti;

function main(){
    if( typeof chrome == 'undefined' ) return;

    //var menuItem = chrome.contextMenus.create({
        //"id": config.dbName
        //, "title": "svae selection text"
        //, "contexts": ["selection"]
    //});

    /*
    var child1 = chrome.contextMenus.create( {
        "id": "save text"
        , "title": "save text"
        , "parentId": menuItem
        , "contexts": ["selection"]
    });
    */

    //chrome.contextMenus.onClicked.addListener( function(info, tab){

        //switch( info.menuItemId ){
            //case config.dbName: {
                //addNote( info, tab ).then( (data)=>{
						//copyNoti = chrome.notifications.create(
							//config.dbName,{   
								//type: 'basic', 
								//iconUrl: '../assets/img/save-everywhere48.png', 
								//title: `${config.dbName} save done!`, 
								//message: `${data.note}`
							//},
							//function() {
								//console.log( 'notification done' );
								//chrome.notifications.clear( config.dbName, ()=>{
									//console.log( 'clear done', Date.now() );
								//});
							//} 
						//);
					//}
				//);
                //break;
            //}
        //}
    /*} )*/
}

