var UTILS = {
		attributelist: require('storm-attributelist')
	},
	UI = (function(w, d) {
		'use strict';

		var Toggle = require('./libs/storm-toggle'),
			init = function() {
				Toggle.init('.js-toggle');
			};

		return {
			init: init
		};

	})(window, document, undefined);


global.STORM = {
    UTILS: UTILS,
    UI: UI
};

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.UI.init, false);