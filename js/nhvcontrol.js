/* nhvcontrol.js
 * Author: Bhaskarsai
 *
 * NeighborhoodViewModel class contains all necessary properties and methods for providing 
 * required functionality of the application from communicating with the third party APIs/Frameworks,
 * and retrieving data into allocated components on the page to interacting with each element and further
 * displaying details via search and other interaction tasks.
 *
 * Properties and Objects defined in this class are tightly integrated within the HTML page using knockout data-binding techniques.
 * 
 */
 
var NeighborhoodViewModel = function() {

	var s = this;  //Assign this to S

	// Constructs the viewModel.
	this.place = ko.observable();  //Place holder
	this.places = ko.observableArray();  //places holder
	this.wikis = ko.observableArray();  //Wiki holder
	this.weather = ko.observable();  //Weather holder
	this.categories = ko.observableArray();  //Categories holder
	this.selectedCategory = ko.observable();  //Selected Category
	this.showPlaces = ko.observable();  //Places
	this.showWikis = ko.observable();  //Display wiki links
	this.showWeather = ko.observable(); //Show weather at the bottom of the map
	this.query = ko.observable('');
	this.wkStatus = ko.observable();  //Wikipedia Status
	this.WUStatus = ko.observable();  //Weather underground status
	this.fsStatus = ko.observable();  //FourSquare status
	this.mapLoadStatus = ko.observable(); //ERROR Handling for google map loading
	this.msgReloadPlaces = ko.observable(false); //Default flag for places reload
	this.msgStatus = ko.observable() //Places reload statu message

	//Method filterList() Adds/removes markers when selecting a filter.	 
	this.filterList = ko.pureComputed(function() {
		var desiredCategory = s.selectedCategory();

		infowindow.close();
		s.place(null);

		return ko.utils.arrayFilter(s.places(), function(p) {
			if (desiredCategory === undefined || p.category === desiredCategory) {

				// Adds marker/place if category matches filter or if all is selected.
				p.marker.setMap(map);
				map.panTo(p.marker.position);
				return true;
			} else {

				// Removes marker/place if category does not match filter.
				p.marker.setMap(null);
				return false;
			}
		});
	});

	this.resetPlaces = function(){
		if(s.places().length <= 1){
			s.msgReloadPlaces(true);
			s.msgStatus("Please wait, places are re-loading...");
			//Blank query
			s.query('');
			s.getPlaces();
		}
	}

	//Method setPlace(Selected_Place); Bounces marker, highlights list item, and opens content on clicked place.
	this.setPlace = function(p) {

		// Removes place, bounce, and content if you click the current place.
		if (s.place() === p) {
			if(s.places().length === 1){
				s.places().length = 0;
				s.removePlace();
				s.resetPlaces();
			}
			//check if user clicked when all places are visible
		} else {
			s.removePlace();
			s.place(p);
			s.place().marker.setAnimation(google.maps.Animation.BOUNCE);
			infowindow.setContent(s.place().content);
			infowindow.open(map, s.place().marker);
			map.panTo(s.place().marker.position);
		}
	};

	//Method clearPlaces(); Clears all markers, places, and categories.
	this.clearPlaces = function() {
		var length = s.places().length;

		for (var i = 0; i < length; i ++) {
			s.places()[i].marker.setMap(null);
		}

		s.removePlace();
		s.places.removeAll();
		s.categories.removeAll();
	};

	//Method removePlace(); Stops marker bounce, closes content, and removes place if one is set.
	this.removePlace = function() {
		if (s.place()) {
			infowindow.close();
			s.place().marker.setAnimation(null);
			s.place(null);
		}
	};

	//Method toggleView(section); Toggles the hide/show of places, weather, and wikis when clicked.
	this.toggleView = function(section) {
		section(!section());
	};

	//Method search(); Clears Places on search submit
	this.search = function() {
		s.clearPlaces();
		s.getPlaces();
	};

	//Method showItem(UL/ListItem); Removes an element, show jQuery appropriate animation.
	this.showItem = function(e) {
		if (e.nodeType === 1) {
			$(e).hide().slideDown();
		}
	};

	//Method hideItem(UL/ListItem); Removes an element, show jQuery appropriate animation.
	 this.hideItem = function(e) {
		if (e.nodeType === 1) {
			$(e).slideUp(function() {
				$(e).remove();
			});
		}
	};

	//Method getWikis();  Get city data from WikiPedia
	this.getWikis = function() {
		
		//Wiki default text during loading
		s.wkStatus('Searching Wikipedia...');
		
		// Displays an error message after 8 seconds of no response if not cleared.
		var wikiRequestTimeout = setTimeout(function() {
				s.wkStatus('Wikipedia is not responding');
		}, 10000);

		//Prepare Data for Ajax transaction
		$.ajax({
			url: 'http://en.wikipedia.org/w/api.php',
			dataType: 'jsonp',
			data: {
				search: Data.neighborhood.city,
				format: 'json',
				action: 'opensearch'
			},
			success: function(response) {

				// Displays an error message when no matches.
				if(response[1].length === 0){
					s.wkStatus('No Wikipedia matches')
				}else{
					s.addWikis(response);
				}

				clearTimeout(wikiRequestTimeout);
			}
		});
	};
	
	//Method addWikis(); Add Wiki article Name and URL to the Wikis Array
	this.addWikis = function(articles) {
		var length = articles[1].length;

		for (var i = 0; i < length; i ++) {
			// Creates an object of wiki name and url as keys.
			var wiki = {
				url: articles[3][i],
				name: articles[1][i]
			};

			// Adds wiki object to wikis array.
			s.wikis.push(wiki);
		}
	};

	//Method sortArrays();  Sort places and categories 
	this.sortArrays = function() {
		s.places.sort(function(a, b) {
		 return (a.name === b.name) ? 0 : (a.name < b.name ? -1 : 1);
		});

		s.categories.sort(function(a, b) {
		 return (a === b) ? 0 : (a < b ? -1 : 1);
		});
	};

	//Method addPlaces(); Populate places into Places Array and 
	//make sure the markers display in their respective areas ;
	this.addPlaces = function(places) {

		// Resets the map bounds before adding places.
		bounds = new google.maps.LatLngBounds();
		var length = places.length;

		for (var i = 0; i < length; i ++) {

			// Adding place titles into places Array
			s.places.push(new Place(places[i].venue));

			// Set-up place markers on the map
			bounds.extend(s.places()[i].marker.position);
		}

		// Display all place markers within the map area
		map.fitBounds(bounds);
		s.sortArrays();
	};

	//Method addCategory(category string): Adds category to the categories array if not already present.
	this.addCategory = function(c) {
		if (s.categories.indexOf(c) === -1) {
			s.categories.push(c);
		}
	};

	//Method clearQuery(); clears query when submitting search query
	this.clearQuery = function() {

		if(s.query() == ""){
			//alert("Empty");
		}else{
			$( ".search-button" ).focus();
			s.query('');
			s.resetPlaces();
			$( ".ui-autocomplete-input" ).focus();
		}
	};

	//Method getPlaces();  Get Places list via foursquare API
	this.getPlaces = function() {

		//set Default status
		s.fsStatus('Load places from Foursquare...');
		
		// Displays an error message after 10 seconds of no response if not cleared.
		var fsRt = setTimeout(function() {
				s.fsStatus('Foursquare is not responding');
		}, 10000);

		//Prepare Data for Ajax transaction
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/explore',
			dataType: 'jsonp',
			data: $.extend({}, Data.foursquareOptions, {query: s.query()}),
			async:false,
			success: function(r) {

				// Displays an error message when no matches.
				if (r.response.totalResults === 0) {
					alert("No results found");
					s.fsStatus('No Foursquare matches');
				} else {
					// Adds places that match.
					s.addPlaces(r.response.groups[0].items);
					s.msgReloadPlaces(false);
				}

				//clear interval when the following line executes
				clearTimeout(fsRt);
			}
		});
	};

	//Method getWeather(); Get Weather information using Weather UnderGround API.
	this.getWeather = function() {

		//Set default weather status text 
		s.WUStatus('Weather search for Irving, Tx');
		// Displays an error message after 10 seconds of no response.
		var wrt = setTimeout(function() {
				s.WUStatus('Weather Underground is not responding');
		}, 10000);

		//Captured Code Sample from Weather Underground for retriving weather data
		$.ajax({
			//DEFAULT URL with embeeded state and city data
		  	url : "http://api.wunderground.com/api/5788f86d5f358bc2/geolookup/conditions/q/TX/Irving.json",
		  	dataType : "jsonp",
		  	success : function(parsed_json) {

		  		//Check if current_observation status is not present
				if(!parsed_json.current_observation){
			  		s.WUStatus('No Weather Underground matches')
				}else{
					s.addWeather(parsed_json.current_observation);
				}

			  //Clear Timeout after 10 seconds of waiting for 
			  clearTimeout(wrt);
		  }
	  });
	};

	//Method addWeather(); Adds weather information to the weather section on the page.
	this.addWeather = function(w) {
		s.weather({
			loc: w.display_location.full,
			temp: 'Present: ' + w.temp_f + '℉',
			feel: 'Feels Like: ' + w.feelslike_f + '℉',
			icon: w.icon_url,
			condition: w.weather,
			forecastUrl: w.forecast_url,
		});
	};
};