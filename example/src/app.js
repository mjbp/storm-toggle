var STORM = (function(w, d) {
        'use strict';

        var Geocoder = require('./libs/storm-geocoder'),
            init = function() {
                console.log(Geocoder);
                Geocoder.init({
                    cb: function(){
                        this.find('Edinburgh');
                    }
                });
            };

        return {
            init: init
        };

    })(window, document, undefined);

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.init, false);