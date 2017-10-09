import should from 'should';
import 'jsdom-global/register';
import Toggle from '../dist/storm-toggle.standalone';

const html = `<a href="#target-1" class="js-toggle_btn">Test toggle</a>
			 <a href="#target-1" class="js-toggle_btn">Test toggle</a>
             <div id="target-1" class="js-toggle" data-toggle="js-toggle_btn"></div>
             <a href="#target-2" class="js-toggle_btn-2">Test toggle</a>
             <div id="target-2" class="js-toggle" data-toggle="js-toggle_btn-2"></div>
			 <a href="#target-3" class="js-toggle_btn-3">Test toggle</a>
             <div id="target-3" class="js-toggle-2" data-toggle="js-toggle_btn-3"></div>
			 <div>
				<a href="#target-4" class="js-toggle__btn-4">Test toggle</a>
				<div id="target-4" class="js-toggle-local" data-toggle="js-toggle__btn-4"></div>
			</div>`;

document.body.innerHTML = html;

let Toggles = Toggle.init('.js-toggle'),
	TogglesWithDelay = Toggle.init('.js-toggle-2', {
		delay: 100,
		callback(){}
	}),
	TogglesLocal = Toggle.init('.js-toggle-local', {
		local: true
	});

describe('Initialisation', () => {
  
	it('should return array of toggles', () => {
		should(Toggles)
		.Array()
		.and.have.lengthOf(2);
	});

	it('should throw an error if no elements are found', () => {
		Toggle.init.bind(Toggle, '.js-err').should.throw();
	});
	
	it('each array item should be an object with the correct properties', () => {
		Toggles[0].should.be.an.instanceOf(Object).and.not.empty();
		Toggles[0].should.have.property('node');
		Toggles[0].should.have.property('settings').Object();
		Toggles[0].should.have.property('init').Function();
		Toggles[0].should.have.property('initToggles').Function();
		Toggles[0].should.have.property('getFocusableChildren').Function();
		Toggles[0].should.have.property('manageFocus').Function();
		Toggles[0].should.have.property('trapTab').Function();
		Toggles[0].should.have.property('toggleAttributes').Function();
		Toggles[0].should.have.property('toggleState').Function();
		Toggles[0].should.have.property('toggle').Function();
	});

	it('should initialisation with different settings if different options are passed', () => {
		should(TogglesWithDelay[0].settings.delay).not.equal(Toggles[0].settings.delay);
	});

	it('should attach the handleClick handler to button click event to toggle documentElement className', () => {
		TogglesWithDelay[0].toggles[0].click();
		setTimeout(() => {
			Array.from(document.documentElement.classList).should.containEql('on--target-3');
			TogglesWithDelay[0].toggles[0].click();
			setTimeout(() => {
				TogglesWithDelay.from(document.documentElement.classList).should.not.containEql('on--target-3');
			}, 1000);
		});
	});

	it('should attach the handleClick handler to button click event to toggle parentNode className', () => {
		TogglesLocal[0].toggles[0].click();
		setTimeout(() => {
			Array.from(TogglersLocal[0].toggles[0].parentNode.classList).should.containEql('active');
			TogglesLocal[0].toggles[0].click();
			setTimeout(() => {
				TogglesLocal.from(TogglersLocal[0].toggles[0].parentNode.classList).should.not.containEql('active');
			}, 1000);
		});
	});
	
	it('should pass an invokable callback as an option', () => {
		TogglesWithDelay[0].settings.should.have.property('callback').Function();
	});

	it('should change sibling buttons aria expanded attribute', () => {
		Toggles[0].toggles[0].click();
		setTimeout(() => {
			Toggles[0].toggles[1].getAttribute('aria-expanded').should.equal(true);
		});
	});

});