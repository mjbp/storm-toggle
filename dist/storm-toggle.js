/**
 * @name storm-toggle: Toggle UI state accessibly
 * @version 0.2.0: Wed, 29 Jun 2016 12:37:18 GMT
 * @author stormid
 * @license MIT
 */(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormToggle = factory();
  }
}(this, function() {
	'use strict';
    
    var instances = [],
        triggerEvents = ['click', 'keydown'],
        defaults = {
            delay: 200,
            targetLocal: false,
            callback: null
		},
        StormToggle = {
            init: function() {
				this.togglers = this.node.getAttribute('data-toggle') && [].slice.call(document.querySelectorAll('.' + this.node.getAttribute('data-toggle')));
				
				if(!!!this.togglers) {
					console.warn('Toggle cannot be initialised, no triggers found');
					return;
				}

                this.open = false;
        		this.classTarget = (!this.settings.targetLocal) ? document.documentElement : this.node.parentNode;
                this.statusClass = (!this.settings.targetLocal) ? ['on--', this.node.getAttribute('id')].join('') : this.statusClass = 'active';
                this.animatingClass = (!this.settings.targetLocal) ? ['animating--', this.node.getAttribute('id')].join('') : this.statusClass = 'animating';
        
				this.initAria();
				
				this.togglers.forEach(function(toggler){
					triggerEvents.forEach(function(e){
						toggler.addEventListener(e, function(e) { this.toggle.call(this, e); }.bind(this), false);
					}.bind(this));
				}.bind(this));
				
            },
			initAria: function() {
				this.togglers.forEach(function(toggler){
					STORM.UTILS.attributelist.set(toggler, {
						'role' : 'button',
						'aria-controls' : this.node.getAttribute('id'),
						'aria-expanded' : 'false'
					});
				}.bind(this));
				STORM.UTILS.attributelist.set(this.node, {
					'aria-hidden': true
				});
			},
			toggleAttributes: function(){
                this.open = !this.open;
                STORM.UTILS.attributelist.toggle(this.node, 'aria-hidden');
                this.togglers.forEach(function(toggler){
                    STORM.UTILS.attributelist.toggle(toggler, 'aria-expanded');
                });
            },
            toggleDocumentState: function(){
                this.classTarget.classList.remove(this.animatingClass);
                this.classTarget.classList.toggle(this.statusClass);
            },
			toggle: function(e){
				var delay = this.classTarget.classList.contains(this.statusClass) ?  this.settings.delay : 0;
				
				if(!!e){
                    e.preventDefault();
                    e.stopPropagation();
                }
                
				this.classTarget.classList.add(this.animatingClass);
				
				window.setTimeout(function() {
                    this.toggleAttributes();
                    this.toggleDocumentState();
					(!!this.settings.callback && typeof this.settings.callback === 'function') && this.settings.callback.call(this);
				}.bind(this), delay);
			}
        };
    
    function init(sel, opts) {
        var els = [].slice.call(document.querySelectorAll(sel));
        
        if(els.length === 0) {
			console.warn('Toggle cannot be initialised, no elements found');
			return;
        }
		
		instances = els.map(function(el){
			return Object.assign(Object.create(StormToggle), {
				node: el,
				settings: Object.assign({}, defaults, opts)
			}).init();
		});
        
		return instances;
    }
	
	return {
		init: init
	};
	
 }));