/* data.js
 * Author: Bhaskarsai
 *
 * Created two dataobjects that are used in this projects
 * neighborhood: It's an object of my current location, includes latitude, longitude, 
 *               City and State information
 *
 * foursquareOptions: Foursquare registered Client id and secret code along with the keys
 *                    that are required to perform foursquare venue Explore operations
 *                    for retrieving various places based on the location.
 */

var Data = {
	neighborhood: {
		lat: 32.8140,
		lng: -96.9488,
		city: 'Irving',
		state: 'TX'
	},

	// Created this object since it was used multiple times.
	foursquareOptions: {
		client_id: 'SFCV0FUJTGRB4FDJWP5BFLAS0SYK2AIF13LUMTDC3A5GQIGN',
		client_secret: 'HXVE0TOUCIDBCVBGZQNHSUSQXF2ED5PKTX1KDBY3CUPYHE43',
		intent: 'checkin',
		radius: 2300,
		limit: 10,
		ll: 32.8140 + ',' + -96.9488,
		m: 'foursquare',
		v: 20150130
	}
};
