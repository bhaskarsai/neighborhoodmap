/* app.js
 * Author: Bhaskarsai
 * Upon loading the page, Map, Wiki, Panel & Weather windows will be rendered on the webpage. 
 * Upon resizing the browser window, the map will be automatically adjusted
 * to the center of the screen. 
 */

// Global variables declration.
var infowindow = new google.maps.InfoWindow(),
	pageControls = new NeighborhoodViewModel(),
	bounds,
	map;

//Create MAP View
var InitLocation = function(lat, lng) {

	//Define Map Features
	var mapFeatures = {
		zoom: 10,
		disableDefaultUI: true,
		scrollwheel: false,
		mapTypeControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: new google.maps.LatLng(lat, lng)
	};

	//Create Map Instance
	map = new google.maps.Map($('.map')[0], mapFeatures);

	// Adjust map when the browser window resizes
	window.addEventListener('resize', function (event) {
		map.fitBounds(bounds);
	});

	//Reset the item active state in the Places list window
	google.maps.event.addListener(infowindow,'closeclick', function() {
		pageControls.setPlace(pageControls.place());
	});
};


//The following Method will prepare and display all the data
//for places, search and autocomplete onLoad.
var Place = function(place) {

	// Extracts info for the place when available and make it ready to populate into the map
	var placeInfo = {
		identity: {
			name: place.name,
			id: place.id
		},

		//Get Location Details
		location: {
			position: new google.maps.LatLng(place.location.lat, place.location.lng),
			address: place.location.address || '',
			city: (place.location.city != undefined) ? place.location.city + ', ' : '',
			state: (place.location.state  != undefined) ? place.location.state + ' ' : '',
			zip: place.location.postalCode || ''
		},

		//Type and URL
		category: {
			name: place.categories[0].shortName,
			categoryUrl: place.categories[0].icon.prefix + 'bg_32' + place.categories[0].icon.suffix
		}
	};

	//Defines Marker features, like icon, title, animation and position details
	var markerOptions = {
		position: placeInfo.location.position,
		map: map,
		icon: markerIcon,
		title: placeInfo.identity.name,
		animation: google.maps.Animation.DROP
	};

	// Creates a specific marker icon image based on category from Foursquare.
	var markerIcon = {
		url: placeInfo.category.categoryUrl,
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(25, 25)
	};

	// Place the details into the Map
	this.name = placeInfo.identity.name;
	this.id = placeInfo.identity.id;
	this.category = placeInfo.category.name;
	this.marker = new google.maps.Marker(markerOptions);

	// Link to Foursquare venue with required reference code.
	this.url = '"http://foursquare.com/v/' + this.id +
		'?ref="' + Data.foursquareOptions.client_id;

	// Content to be displayed in the marker infowindow.
	this.content = '<div class="content"><h3><a href=' + this.url + '>' +
		this.name + '</a></h3><h4>' + placeInfo.location.address + '<br>' +
		placeInfo.location.city + placeInfo.location.state +
		placeInfo.location.zip + '</h4></div>';

	// Sends the category to the viewModel to process.
	pageControls.addCategory(this.category);

	// Triggers an emulated click on the place list when the marker is clicked.
	google.maps.event.addListener(this.marker, 'click', function() {
		$('#' + place.id).trigger('click');
	});
};

//Render map and other components upon loading the page.
$(document).ready(function() {

	//Method for rendering Map, wiki, weather, places, and search autocomplete.
	var Intialize = function () {

		// Intiializes ko bindings and the map view.
		ko.applyBindings(pageControls);
		InitLocation(Data.neighborhood.lat, Data.neighborhood.lng);

		// Mobile View : Hides places, wikis, and weather sections
		if (screen.width < 1024) {
			pageControls.showWikis(false);
			pageControls.showWeather(false);
			pageControls.showPlaces(false);
		}

		// Load Wiki, Weather and Places list on top of the map
		pageControls.getWikis();
		pageControls.getWeather();
		pageControls.getPlaces();

		// FourSquare AutoComplete Plugin embedded with the search box 
		$('.ui-autocomplete-input').foursquareAutocomplete(Data.foursquareOptions);
	};

	//Start Loading Map and the KO Components
	Intialize();
});