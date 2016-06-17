#Storm Toggle

Progressive enhancement-lead, accessible state toggling. Toggles classes for CSS-based UI state manipulation.

    - Toggle documentElement classes based on target, style agnostic so you can apply your own styles and transitions based on page states
    - Or toggle parent element class to change localised UI states, or sub-states
    - Uses id/href-based targeting, so falls back to a fragment identifier link
    - Adds and toggles ARIA attributes
    - Built-in transition delays and animating-out class to hook transitions on to avoid unwanted animations on load/resize
    - Based on standard HTML5 markup

##Use cases

    - off-canvas elements, including hamburger or kebab navigation
    - dropdown toggles, show/hide
    - any basic UI animation involving an element trigger
    - localised UI sub-state toggling applies to child or nested elements, such as submenu item children, or nay other nested togglable compomonent
    
##Usage
```
npm install storm-toggler
```

```js
var Toggler = require('storm.toggler');
Toggler.init(document.querySelectorAll('.js-toggle', {delay: 360}));

```

##Options
@param
delay, Number, milliseconds the animating class persists, corresponding to duration of your CSS animation/transition, default 200ms

@param
targetLocal, Boolean, determine where the state classes are added so the toggler can toggle global (page-wide) state or local (subcollection of DOM), default false

@param
callback, function, called after each toggle event

##API
    
    - init, function, initialise
    - open, boolean, status of toggled element
    - toggle, function, switch state
    - reload, function
    - destroy, function
	