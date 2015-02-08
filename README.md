# neighborhoodmap
Neighborhood map project for Udacity nanodegree

#Overview:
This project was build using a single HTML page.  All the interactions on this page were built/developed using multiple frameworks.<br /><br />
The HTML page contains a Google Map, which displays my neighborhood information on the map with highlighted markers.  The map was rendered using knockout and Jquery frameworks, while the popular plaes around my neighborhood are rendered using foursquares framework.  The page also displays weather information of my location.  The funcitionality on the map is highly interactive, by capturing user choice and display further information in wikipedia.  <br /><br />
The neighborhood project can be viewed from the following location.<br />
http://htmlpreview.github.io/?https://github.com/bhaskarsai/neighborhoodmap/blob/master/index.html#

#Highlights:
a) Google Map showing my neightbood areas
		Google map loads my current area to the desktop

b) Popular locations around my neighbor hood<br >
		Loads 15 popular areas<br >
		Clicking on each place will launch new content in their respective section. (All links open in a new window)<br >
		Toggling Place-Markers between jumping animation to static image.<br >
		Active and default states of the list items, upon clicking on the list or place markers on the map<br >
		All markers open in the center of the page.<br >
		Show/Hide option for the panel window<br >
		Sorted category list in the drop-down<br ><br >

c) Weather-Information<br >
		Display current Temperature and feels like details<br >
		Clicking on the link will launch more info a new window<br >
		show/Hide option of the weather panel window<br ><br >

d) information from Wikipedia<br >
		Search wikipedia data based on the city<br >
		Open links in new wikipedia window<br >
		Show/Hide option for the wiki window<br ><br >

e) Search results<br >
		Enter a keyword, hit enter or press search<br >
		The panel window will be updated accordingly<br >
		Based on valid keywords, the search in-put will help show some results (autocomplete)<br ><br >

f) Popular categories in Drop-down for easy navigation<br >
		Drop-down in places area will be updated with alphabetical order list<br >
		Upon selecting an item, place markers will be filtered to that item<br ><br >

g) Responsive layout (works in both desktop and mobile devices)<br >
		Content renders in Desktop environemnt separately (CSS)<br >
		Content renders in mobile devices separately (CSS)<br ><br >

#Reference resources
Primary reference when I am stuck: <br />http://stackoverflow.com<br /><br />
Google Maps API: <br >https://developers.google.com/maps/documentation/javascript/reference<br ><br >
KnockoutJS:<br >http://knockoutjs.com/documentation/introduction.html<br ><br >
Foursquare API:<br >https://developer.foursquare.com/start<br ><br >
Weather Undergroud API:<br >http://www.wunderground.com/weather/api/d/docs<br ><br >
Wikipedia API:<br >http://www.mediawiki.org/wiki/API:Main_page<br ><br >
jQuery-UI: http://api.jqueryui.com/autocomplete/<br ><br >
Foursquare autocomplete plugin:<br > http://josephguadagno.net/post/2012/03/19/Foursquare-Autocomplete-jQuery-Plugin<br ><br >
