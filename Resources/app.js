Ti.App.Properties.setList("entries", []);
Ti.App.Properties.setString('bestEntryDefaultValue', JSON.stringify({
    coordinates: {
        accuracy: 9999
    }
}));
Ti.App.Properties.setString("currentlyBestEntry", Ti.App.Properties.getString("bestEntryDefaultValue"));

var service;

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

var label = Ti.UI.createLabel({
	text:'',
	height: 'auto',
	top: 0
});

var label2 = Ti.UI.createLabel({
	text:'',
	height: 'auto',
	top: 15
});

var label3 = Ti.UI.createLabel({
	text:'',
	height: 'auto',
	top: 30
});


var startbutton = Titanium.UI.createButton({
	title:'Start',
	color: 'green',
	backgroundColor: '#000',
	size: {
		width: 100,
		height: 50
	},
	top: 2,
	left: 200
});

var stopbutton = Titanium.UI.createButton({
	title:'Stop',
	color: 'red',
	backgroundColor: '#000',
	size: {
		width: 100,
		height: 50
	},
	top: 2,
	left: 200
});


var resendbutton = Titanium.UI.createButton({
	title:'Resend',
	color: 'yellow',
	backgroundColor: '#000',
	size: {
		width: 70,
		height: 40
	},
	top: 70,
	left: 200
});

var sliderLabel = Ti.UI.createLabel({
	text: 'interval: ' + ( Tracker.settings.selectionInterval / 1000 ) + "         accuracy: " + Tracker.settings.minimumAccuracyToAccept,
	height: 'auto',
	top: 300
});

var intervalSlider = Ti.UI.createSlider({
    value: 5,
    min: 1,
    max: 30,
    left: 10,
    width: 145,
	top:320
});

intervalSlider.addEventListener('change', function(e) {
	var intervalSeconds = Math.floor(e.value);
	Tracker.settings.selectionInterval = intervalSeconds * 1000;

	sliderLabel.text = 'interval: ' + ( Tracker.settings.selectionInterval / 1000 ) + "         accuracy: " + Tracker.settings.minimumAccuracyToAccept;
});


var accuracySlider = Ti.UI.createSlider({
    value: 100,
    min: 50,
    max: 800,
    left: 165,
	width: 145,
	top:320
});

accuracySlider.addEventListener('change', function(e) {
	var accuracyMeters = Math.floor(e.value);
	Tracker.settings.minimumAccuracyToAccept = accuracyMeters;

	sliderLabel.text = 'interval: ' + ( Tracker.settings.selectionInterval / 1000 ) + "         accuracy: " + Tracker.settings.minimumAccuracyToAccept;
});

function registerTrackerService(e) {
    Ti.API.info("app was paused from the foreground");

    stopTracking();
	Ti.API.info("stopped foreground tracking");

    service = Ti.App.iOS.registerBackgroundService({url:'tracker_service.js'});
    Ti.API.info("registered background service = "+service);
}

function unregisterTrackerService(e) {
    Ti.API.info("app has resumed from the background");
    // this will unregister the service if the user just opened the app
    // ie: not via the notification 'OK' button..
    if(service!=null){
        service.stop();
        service.unregister();
    }

    startTracking();
    Ti.API.info("started foreground tracking");
}

function onTrackingStart(e) {
	startbutton.hide();
	stopbutton.show();

	accuracySlider.enabled = false;
	intervalSlider.enabled = false;

    startTracking();

    Ti.API.info("starting to track geolocation");

    Titanium.Geolocation.addEventListener('location', onReceivePosition);

    if (isiOS4Plus()){
        Ti.App.addEventListener('resumed',unregisterTrackerService);

        Ti.App.addEventListener('pause', registerTrackerService);
    }

	Titanium.API.info("interval started");

	label.text = "started at " + formattedDate(new Date());
}


function onTrackingStop(e) {
	stopbutton.hide();
	startbutton.show();
	accuracySlider.enabled = true;
	intervalSlider.enabled = true;


	stopTracking();

    if(service!=null){
        service.stop();
        service.unregister();
    }

    if (isiOS4Plus()){
        Ti.App.removeEventListener('resumed',unregisterTrackerService);

        Ti.App.removeEventListener('pause', registerTrackerService);
    }

    Titanium.Geolocation.removeEventListener('location', onReceivePosition);

	Titanium.API.info("stopped timer");

	Titanium.API.info(Ti.App.Properties.getList("entries"));

	Tracker.backend.postEntries(Ti.App.Properties.getList("entries"));

	label.text = "stopped at " + formattedDate(new Date());
}

resendbutton.addEventListener("click", onTrackingStop);

startbutton.addEventListener('click', onTrackingStart);
stopbutton.addEventListener('click', onTrackingStop);



win1.add(Tracker.views.mapView);

win1.add(startbutton);
win1.add(stopbutton);
win1.add(resendbutton);

win1.add(label);
win1.add(label2);
win1.add(label3);

win1.add(intervalSlider);
win1.add(accuracySlider);

win1.add(sliderLabel);

stopbutton.hide();

var tab1 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});

//
// create controls tab and root window
//


var win2 = Titanium.UI.createWindow({ url: "browser.js" });

var tab2 = Titanium.UI.createTab({
    icon:'KS_nav_ui.png',
    title:'Tab 2',
    window:win2
});


//
//  add tabs
//
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);


// open tab group
tabGroup.open();
