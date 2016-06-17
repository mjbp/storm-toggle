/**
 * @name storm-geocoder: Google Maps API geocoder loader and abstraction layer
 * @version 0.1.0: Fri, 17 Jun 2016 16:38:09 GMT
 * @author stormid
 * @license MIT
 */(function(root, factory) {
    if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormGeocoder = factory();
  }
}(this, function() {
    'use strict';

    var instance,
        loadScript = function(src) {
            var script = document.createElement('script'),
                timer = window.setTimeout(function() {
                    console.warn('Script ' + src + ' failed to load in time.');
                }, 5000);
            script.src = src;
            script.onload = function() {
                window.clearTimeout(timer);
            };
            document.body.appendChild(script);
        },
        defaults = {
            key: null
        },
        StormGeocoder = {
            init: function (fn) {
                if (!global.google) { this.loadAPI(fn); }
                else { fn.apply(this, arguments); }
            },
            loadAPI: function (fn) {
                var API = 'http://maps.googleapis.com/maps/api/js?callback=GoogleMapsAPILoaded' + (!!this.settings.key && '&key=' + this.settings.key),
                    GoogleMapsAPILoaded = function () {
                        delete window.GoogleMapsAPILoaded;
                        this.settings.cb && this.settings.cb.apply(this, arguments);
                    }.bind(this);

                window.GoogleMapsAPILoaded = GoogleMapsAPILoaded;

                loadScript(API);
            },
            find: function(q, cb){
                var geocoder = new global.google.maps.Geocoder();
                 
                geocoder.geocode({ 
                        address: q
                    }, cb);
            }
        };

    function init(opts) {
        instance = Object.assign(Object.create(StormGeocoder), {
            settings: Object.assign({}, defaults, opts)
        });
        instance.init();
    }

    return {
        init: init
    };

 }));