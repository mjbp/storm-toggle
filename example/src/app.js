var STORM = (function(w, d) {
        'use strict';

        var Geocoder = require('./libs/storm-geocoder'),
            init = function() {
                Geocoder.find('Edinburgh');
                /*
                Geocoder.init({
                    cb: function(){
                        this.find('Edinburgh');
                    }
                });
                */
            };

        return {
            init: init,
            geocoder: Geocoder
        };

    })(window, document, undefined);

window.STORM = STORM;

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.init, false);