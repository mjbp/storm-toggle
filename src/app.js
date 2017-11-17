import Toggle from './libs/component';

const onDOMContentLoadedTasks = [() => {
	let toggle = Toggle.init('.js-toggle');
	let localToggle = Toggle.init('.js-toggle-local', { local: true });
	console.log(toggle);

}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach(fn => fn()); });
