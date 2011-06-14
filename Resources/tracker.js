var Tracker = {
	settings: {
		apiUrl: "http://imightbeaniceuser:ireallyamaniceuser@reittiproto-backend-enemyfi.heroku.com/routes",
		selectionInterval: 10000,
		distanceFilter: 10,
		minimumAccuracyToAccept: 300
	},

	views: {
		mapView: Ti.Map.createView({
		    mapType: Ti.Map.STANDARD_TYPE,
		    animate:true,
		    regionFit:true,
		    userLocation:true,
			height: 200,
			top: 200
		})
	}
};

// Ti.Geolocation.distanceFilter = Tracker.settings.distanceFilter;
Ti.Geolocation.purpose = "Bigbrotherism";
// Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
// Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

function onReceivePosition(position) {
	// This is in interval, so calling with this.blblalba doesnt work!

	Ti.API.info("Received position");


	// ALWAYS do this, even if data sucks:

 	/* set an attribute of GeoLocation to make
       getCurrentPosition work multiple times */
    Ti.Geolocation.distanceFilter = Tracker.settings.distanceFilter;

	// raise accuracy requirements for subsequent calls
	Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;

	if (position.success == false) {
		return null;
	};

    // label3.text = "acc: " + position.coords.accuracy + "\nspeed: " + position.coords.speed + "\nlat: " + position.coords.latitude + "\nlon:" + position.coords.longitude;

	if (position.coords.accuracy > Tracker.settings.minimumAccuracyToAccept) {
		return null;
	} else {
    	Tracker.views.mapView.setLocation({
    		latitude: position.coords.latitude, longitude: position.coords.longitude,
    		latitudeDelta:0.01, longitudeDelta:0.01
    	});
    	var currentlyBestEntry = {
    		created_at: Math.round(new Date().getTime() / 1000), // returns the number of seconds since the epoch
    		coordinates: position.coords
    	};

    	Ti.App.Properties.setString("currentlyBestEntry", JSON.stringify(currentlyBestEntry));

    	Titanium.API.info("maed new entry!");
	};

    // label2.text = "tracked " + Tracker.tracking.entries.length + "points so far";
}

setInterval(function() {
     Ti.API.info("setting currently best to actual entries");
     var current_best_entry = JSON.parse(Ti.App.Properties.getString("currentlyBestEntry"));
     var current_entries = Ti.App.Properties.getList("entries");

     current_entries.push(current_best_entry);

     Ti.App.Properties.setList("entries", current_entries);
}, Tracker.settings.selectionInterval);

Ti.API.info("starting to track geolocation");

Titanium.Geolocation.getCurrentPosition(onReceivePosition);

Titanium.Geolocation.addEventListener('location', onReceivePosition);
