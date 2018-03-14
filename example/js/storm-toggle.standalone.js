/**
 * @name storm-toggle: Toggle UI state accessibly
 * @version 1.2.3: Fri, 09 Mar 2018 13:44:00 GMT
 * @author stormid
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.StormToggle = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaults = {
	delay: 0,
	startOpen: false,
	local: false,
	prehook: false,
	callback: false,
	focus: false,
	trapTab: false,
	closeOnBlur: false
};

var TRIGGER_EVENTS = ['click', 'keydown'];
var TRIGGER_KEYCODES = [13, 32];
var FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

var componentPrototype = {
	init: function init() {
		this.toggles = this.node.getAttribute('data-toggle') && [].slice.call(document.querySelectorAll('.' + this.node.getAttribute('data-toggle')));
		if (!this.toggles) return console.warn('Toggle cannot be initialised, no toggle buttons elements found'), false;

		this.isOpen = false;
		if (this.settings.focus) this.focusableChildren = this.getFocusableChildren();
		if (this.settings.trapTab) this.boundKeyListener = this.keyListener.bind(this);
		if (this.settings.closeOnBlur) this.boundFocusInListener = this.focusInListener.bind(this);
		this.classTarget = !this.settings.local ? document.documentElement : this.node.parentNode;
		this.statusClass = !this.settings.local ? 'on--' + this.node.getAttribute('id') : 'active';
		this.animatingClass = !this.settings.local ? 'animating--' + this.node.getAttribute('id') : 'animating';

		this.initToggles();
		this.settings.startOpen && this.toggle();

		return this;
	},
	initToggles: function initToggles() {
		var _this = this;

		this.toggles.forEach(function (toggle) {
			toggle.setAttribute('role', 'button');
			toggle.setAttribute('aria-controls', _this.node.getAttribute('id'));
			toggle.setAttribute('aria-expanded', 'false');
			TRIGGER_EVENTS.forEach(function (ev) {
				toggle.addEventListener(ev, function (e) {
					if (!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
					e.preventDefault();
					_this.toggle();
				});
			});
		});
	},
	getFocusableChildren: function getFocusableChildren() {
		return [].slice.call(this.node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));
	},

	toggleAttributes: function toggleAttributes() {
		this.isOpen = !this.isOpen;
		this.toggles.forEach(function (toggle) {
			toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
		});
	},
	toggleState: function toggleState() {
		this.classTarget.classList.remove(this.animatingClass);
		this.classTarget.classList.toggle(this.statusClass);
	},
	manageFocus: function manageFocus() {
		var _this2 = this;

		if (!this.isOpen) {
			this.lastFocused = document.activeElement;
			this.focusableChildren.length && window.setTimeout(function () {
				return _this2.focusableChildren[0].focus();
			}, this.settings.delay);
			this.settings.trapTab && document.addEventListener('keydown', this.boundKeyListener);
		} else {
			this.settings.trapTab && document.removeEventListener('keydown', this.boundKeyListener);
			this.focusableChildren.length && window.setTimeout(function () {
				_this2.lastFocused.focus();
				_this2.lastFocused = false;
			}, this.settings.delay);
		}
	},
	trapTab: function trapTab(e) {
		var focusedIndex = this.focusableChildren.indexOf(document.activeElement);
		if (e.shiftKey && focusedIndex === 0) {
			e.preventDefault();
			this.focusableChildren[this.focusableChildren.length - 1].focus();
		} else {
			if (!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
				e.preventDefault();
				this.focusableChildren[0].focus();
			}
		}
	},
	keyListener: function keyListener(e) {
		if (this.isOpen && e.keyCode === 27) {
			e.preventDefault();
			this.toggle();
		}
		if (this.isOpen && e.keyCode === 9) this.trapTab(e);
	},

	focusInListener: function focusInListener(e) {
		if (!this.node.contains(e.target) && !this.toggles.reduce(function (acc, toggle) {
			if (toggle === e.target) acc = true;
			return acc;
		}, false)) this.toggle();
	},
	manageBlurClose: function manageBlurClose() {
		if (!this.isOpen) document.addEventListener('focusin', this.boundFocusInListener);else document.removeEventListener('focusin', this.boundFocusInListener);
	},
	toggle: function toggle(e) {
		var _this3 = this;

		var delay = this.classTarget.classList.contains(this.statusClass) ? this.settings.delay : 0;

		!!this.settings.prehook && typeof this.settings.prehook === 'function' && this.settings.prehook.call(this);

		if (e) e.preventDefault(), e.stopPropagation();

		this.classTarget.classList.add(this.animatingClass);

		window.setTimeout(function () {
			!!_this3.settings.focus && _this3.focusableChildren && _this3.manageFocus();
			!!_this3.settings.closeOnBlur && _this3.manageBlurClose();
			_this3.toggleAttributes();
			_this3.toggleState();
			!!_this3.settings.callback && typeof _this3.settings.callback === 'function' && _this3.settings.callback.call(_this3);
		}, delay);
	}
};

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (els.length === 0) throw new Error('Toggle cannot be initialised, no trigger elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(componentPrototype), {
			node: el,
			settings: Object.assign({}, defaults, el.dataset, opts)
		}).init();
	});
};

var index = { init: init };

exports.default = index;;
}));
