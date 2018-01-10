/**
 * @name storm-toggle: Toggle UI state accessibly
 * @version 1.0.2: Wed, 10 Jan 2018 15:02:35 GMT
 * @author stormid
 * @license MIT
 */
import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel));
	
	if(els.length === 0) throw new Error('Toggle cannot be initialised, no trigger elements found');
	
	return els.map(el => Object.assign(Object.create(componentPrototype), {
			node: el,
			settings: Object.assign({}, defaults, el.dataset, opts)
		}).init());
};
    
export default { init };