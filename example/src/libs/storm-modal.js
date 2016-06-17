/**
 * @name storm-modal: Accessible modal dialogue
 * @version 0.1.0: Sat, 19 Mar 2016 19:48:24 GMT
 * @author stormid
 * @license MIT
 */(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormModal = factory();
  }
}(this, function() {
	'use strict';
    
    var instances = [],
        defaults = {
			onClassName: 'active',
			modalSelector: 'js-modal',
			styles: [
				{
					opacity: 0,
					visibility: 'hidden',
					position: 'absolute',
					overflow: 'hidden',
					width:	0,
					height:0
				},
				{
					opacity:1,
					visibility: 'visible',
					overflow: 'auto',
					position: 'fixed',
					width: 'auto',
					height: 'auto',
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					zIndex: 9
				}]
        },
        StormModal = {
            init: function() {
				this.isOpen = false;
				this.togglers = this.node.getAttribute('data-modal-toggler') && [].slice.call(document.querySelectorAll('.' + this.node.getAttribute('data-modal-toggler')));
				
				if(!!!this.togglers) {
					throw new Error('Modal cannot be initialised, no modal toggler elements found');
				}
                this.togglers.forEach(function(toggler){
					toggler.addEventListener('click', this.toggle.bind(this), false);
				}.bind(this));
				this.focusableChildren = this.getFocusableChildren();
				this.setStyles();
				this.node.setAttribute('aria-hidden', true);
            },
			getFocusableChildren: function() {
				var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

				return [].slice.call(this.node.querySelectorAll(focusableElements.join(','))).filter(function (child) {
				  return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
				});
			},
			trapTab: function(e){
				var focusedIndex = this.focusableChildren.indexOf(document.activeElement);
				console.log(focusedIndex);
				if(e.shiftKey && focusedIndex === 0) {
					e.preventDefault();
					this.focusableChildren[this.focusableChildren.length - 1].focus();
				} else {
					if(!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
						e.preventDefault();
					  	this.focusableChildren[0].focus();
					}
				}
			},
			setStyles: function() {
				for(var s in this.settings.styles[Number(this.isOpen)]) {
					this.node.style[s] = this.settings.styles[Number(this.isOpen)][s];
				}
			},
			keyListener: function(e){
				if (this.isOpen && e.keyCode === 27) {
					e.preventDefault();
					this.toggle();
				}
				if (this.isOpen && e.keyCode === 9) {
					this.trapTab(e);
				}
			},
			open: function() {
				document.addEventListener('keydown', this.keyListener.bind(this));
				this.lastFocused =  document.activeElement;
				window.setTimeout(function(){this.focusableChildren[0].focus();}.bind(this), 0);
			},
			close: function(){
				document.removeEventListener('keydown', this.keyListener.bind(this));
				this.lastFocused.focus();
			},
			toggle: function() {
				if(!this.isOpen){
					this.open();
				} else {
					this.close();
				}
				
				this.isOpen = !this.isOpen;
				this.setStyles();
				this.node.setAttribute('aria-hidden', !this.isOpen);
				document.querySelector('main') && document.querySelector('main').setAttribute('aria-hidden', this.isOpen);
			}
        };
    
    function init(sel, opts) {
        var els = [].slice.call(document.querySelectorAll(sel));
        
        if(els.length === 0) {
            throw new Error('Modal cannot be initialised, no trigger elements found');
        }
		
		instances = els.map(function(el){
			return STORM.UTILS.assign(Object.create(StormModal), {
				node: el,
				settings: STORM.UTILS.merge({}, defaults, opts)
			}).init();
		});
        
		return instances;
    }
	
	return {
		init: init
	};
	
 }));