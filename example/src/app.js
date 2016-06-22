var STORM = (function(w, d) {
        'use strict';

        var STATUS_CODES = {
                ZERO_RESULTS: 'ZERO_RESULTS'
            },
            Geocoder = require('./libs/storm-geocoder'),
            init = function() {
                var resultsWrapperTemplate = '<ul class="js-results">{{results}}</ul>',
                    resultTemplate = '<li>{{result}}</li>';

                d.querySelector('.js-geocode').addEventListener('submit', function(e){
                    e.preventDefault();
                    Geocoder.find(this.q.value, function(err, res){
                        if(err) {
                            if(err === STATUS_CODES.ZERO_RESULTS) {
                                var msg = '<p class="js-results">Nothing found by Google</p>';
                                if(!!d.querySelector('.js-results')) {
                                    d.querySelector('.js-results').innerHTML = msg;
                                } else {
                                    d.querySelector('.js-geocode').insertAdjacentHTML('afterend', msg);
                                }
                            }
                            console.warn(err);
                            return;
                        }
                        //this is what you get back from Google
                        console.log(res);

                        //You could output part of it like this
                        if(!!d.querySelector('.js-results')) {
                            d.querySelector('.js-results').innerHTML = res.reduce(function(prev, curr){
                                return prev + resultTemplate.split('{{result}}').join(curr.formatted_address);
                            }, '');
                        } else {
                            d.querySelector('.js-geocode').insertAdjacentHTML('afterend', resultsWrapperTemplate.split('{{results}}').join(res.reduce(function(prev, curr){
                                return prev + resultTemplate.split('{{result}}').join(curr.formatted_address);
                            }, '')));
                        }

                    });
                }, false);
            };

        return {
            init: init
        };

    })(window, document, undefined);

window.STORM = STORM;

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.init, false);