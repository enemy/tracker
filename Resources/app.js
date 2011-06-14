Ti.App.Properties.setList("entries", []);
Ti.App.Properties.setString("currentlyBestEntry", JSON.stringify(""));

Ti.include("tracker.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 1',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win1.add(label1);

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({
    title:'Tab 2',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({
    icon:'KS_nav_ui.png',
    title:'Tab 2',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);



//
//  add tabs
//
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);


// open tab group
tabGroup.open();

// test for iOS 4+
function isiOS4Plus(){
    if (Titanium.Platform.name == 'iPhone OS'){
        var version = Titanium.Platform.version.split(".");
        var major = parseInt(version[0]);
        // can only test this support on a 3.2+ device
        if (major >= 4){
            return true;
        }
    }
    return false;
}

if (isiOS4Plus()){

    var service;

    // Ti.App.iOS.addEventListener('notification',function(e){
        // You can use this event to pick up the info of the noticiation.
        // Also to collect the 'userInfo' property data if any was set
        // Ti.API.info("local notification received: "+JSON.stringify(e));
    // });

    // fired when an app resumes from suspension


    Ti.App.addEventListener('resume',function(e){
        Ti.API.info("app is resuming from the background");
    });
    Ti.App.addEventListener('resumed',function(e){
        Ti.API.info("app has resumed from the background");
        // this will unregister the service if the user just opened the app
        // ie: not via the notification 'OK' button..
        if(service!=null){
            service.stop();
            service.unregister();
        }
        //Titanium.UI.iPhone.appBadge = null;
    });

    Ti.App.addEventListener('pause',function(e){
        Ti.API.info("app was paused from the foreground");

        service = Ti.App.iOS.registerBackgroundService({url:'tracker_service.js'});
        Ti.API.info("registered background service = "+service);

    });
}
