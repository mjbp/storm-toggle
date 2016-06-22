(function(root, factory) {
    if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormGeocoder = factory();
  }
}(this, function() {
    'use strict';

    var MAX_ATTEMPTS = 250,
        instance,
        loadScript = function(src) {
            var script = document.createElement('script'),
                timer = window.setTimeout(function() {
                    console.warn('Script ' + src + ' failed to load in time.');
                }, 5000);
            script.src = src;
            script.onload = function() {
                window.clearTimeout(timer);
            }.bind(this);
            document.body.appendChild(script);
        },
        defaults = {
            key: null
        },
        StormGeocoder = {
            init: function (fn) {
                if (!window.google) { 
                    this.loadAPI(fn);
                    console.log(this);
                    return this;
                }
                else { fn.apply(this, arguments); }
            },
            loadAPI: function (fn) {
                var API = 'http://maps.googleapis.com/maps/api/js?callback=GoogleMapsAPILoaded' + (!!this.settings.key && '&key=' + this.settings.key || ''),
                    GoogleMapsAPILoaded = function () {
                        delete window.GoogleMapsAPILoaded;
                        this.settings.cb && this.settings.cb.apply(this, arguments);
                    }.bind(this);

                window.GoogleMapsAPILoaded = GoogleMapsAPILoaded;

                loadScript.call(this, API);
            },
            await: function(cb, fn){
                var attempts = 0,
                    timer = function(){
                        var timeout = window.setTimeout(function(){
                                attempts++;
                                window.clearInterval(timeout);
                                if(attempts === MAX_ATTEMPTS) {
                                    cb('Google Maps API has timed out', null);
                                    return;
                                }
                                if(!window.google){
                                    timer();
                                } else {
                                    fn.apply(this);
                                }
                            }.bind(this), 16);
                    };
                timer();
            },
            find: function(q, cb){
                var fn = function(){
                        var geocoder = new window.google.maps.Geocoder();
                    
                        geocoder.geocode({ 
                            address: q
                        }, function(res, status){
                            if (status !== global.google.maps.GeocoderStatus.OK) { 
                                cb(status, res);
                                return;
                            }
                            cb(null, res);
                        });
                };
                if(!window.google) {
                    this.await(cb, fn);
                } else {
                    fn();
                }
                
            }
        };

    function init(opts) {
        return Object.assign(Object.create(StormGeocoder), {
            settings: Object.assign({}, defaults, opts)
        }).init();
    }

    return { init: init };

 }));