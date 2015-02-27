/**
 * @fileoverview jQuery-ui plugin used for the search autocomplete.
 * This code was outdated and had to be refactored to work with
 * modern jQuery-ui, Foursquare API, and my app.  I also
 * reformated the code to align with the style guide.  I did remove
 * some error functions as they seemed not to work anymore and I
 * have my own error trapping in the app.
 * Source: http://josephguadagno.net/post/2012/03/19/Foursquare-Autocomplete-
 * jQuery-Plugin
 * @author jguadagno@hotmail.com (Joseph Guadagno)
 */

 /** Controls the search autocomplete after instantiation by app.js.
  * @type {function}
  */
(function ($) {

	/** Combines user and default options into one object.
	 * @param element The element instantiated.
	 * @param options The user defined options.
  	 * @type {function}
  	 */
	$.foursquareAutocomplete = function (element, options) {
		this.options = {};
		element.data('foursquareAutocomplete', this);
		/** Initiates the combination of the options.
	 	 * @param element The element instantiated.
	 	 * @param options The user defined options.
  	 	 * @type {function}
  	 	 */
		this.init = function (element, options) {
			this.options = $.extend(
				{},
				$.foursquareAutocomplete.defaultOptions,
				options);

			this.options = $.metadata ? $.extend(
				{},
				this.options,
				element.metadata()
			) : this.options;

			updateElement(element, this.options);
		};

		this.init(element, options);
	};

	/** Applied the new combined options object.
	 * @param options The combined options.
  	 * @type {function}
  	 */
	$.fn.foursquareAutocomplete = function (options) {
		return this.each(function () {
			(new $.foursquareAutocomplete($(this), options));
		});
	};

	/** AJAX request find suggestions after 3 characters are typed.
	 * @param element The element instantiated.
	 * @param options The combined options.
  	 * @type {function}
  	 */
	function updateElement(element, options) {
		element.autocomplete({
			source: function (request, response) {
				$.ajax({
					url: 'https://api.foursquare.com/v2/venues/suggestcompletion',
					dataType: 'jsonp',
					data: {
						ll: options.ll,
						v: options.v,
						client_id: options.client_id,
						client_secret: options.client_secret,
						radius: options.radius,
						limit: options.limit,
						intent: options.intent,
						minLength: options.minLength,
						m: options.m,
						query: request.term
					},
					success: function (data) {
						response($.map(data.response.minivenues, function (item) {

							// Makes sure suggestions are for the current city and state.
							if (item.location.city === Data.neighborhood.city &&
								item.location.state === Data.neighborhood.state) {

								return {
									name: item.name,
									id: item.id,
									address: item.location.address ? item.location.address :
										'&nbsp;',
									city: item.location.city ? item.location.city + ', ' : '',
									state: item.location.state ? item.location.state + ' ' : '',
									zip: item.location.postalCode || '',
									photo: item.categories[0].icon ?
										item.categories[0].icon.prefix + 'bg_32' +
										item.categories[0].icon.suffix : '',
									venue: item
								};
							}
						}));
					},
				});
			},
			select: function (event, ui) {
				// Triggers a function when an item is clicked.
				options.search(event, [ui.item]);
				return false;
			},
			
			open: function () {
				$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
			},
			
			close: function () {
				$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
			}
		})

		// Creates the <ul> element to hold suggestions.
		.data('ui-autocomplete')._renderItem = function (ul, item) {
			return $('<li></li>')
			.data('ui-autocomplete-item', item)
			.append('<a href="#" style="text-decoration:none">' + getAutocompleteText(item) + '</a>')
			.appendTo(ul);
		};

	}

	/** Holds default options.
  	 * @type {Object}
  	 */
	$.foursquareAutocomplete.defaultOptions = {
		minLength: 3,
		select: function(event, ui) {},
		search: function (event, ui) {
			pageControls.clearPlaces();
			pageControls.addPlaces(ui);
			pageControls.setPlace(pageControls.places()[0]);
			return false;
		}
	};

	/// Creates the <li> elements for the suggestions.
	function getAutocompleteText(item) {
		var text = '<div style="background-color:#ccc"><img class ="ui-menu-icon" src="' + item.photo +'">' + '<div class="ui-widget-header">' + item.name + '<br />' + item.city + item.state + item.zip + '<hr /></div>';
		return text;
	}
})(jQuery);