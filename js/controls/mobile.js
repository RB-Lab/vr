import observable from '../lib/observable';
import fullscreen from './utils/fullscreen';

const subscribers = observable();

export default function mobileControls() {
	const orientation = {
		alpha: 0,
		beta: 0,
		gamma: 0,
		orientation: 0
	};

	function enable() {
		window.addEventListener('orientationchange', updateScreenOrientation);
		window.addEventListener('deviceorientation', updateDeviceOrientation);
		window.addEventListener('click', fullscreen);
	}

	function disable() {
		window.removeEventListener('orientationchange', updateScreenOrientation);
		window.removeEventListener('deviceorientation', updateDeviceOrientation);
		window.removeEventListener('click', fullscreen);
	}

	function updateDeviceOrientation(e) {
		orientation.alpha = getAngele(e.alpha);  // Z
		orientation.beta = getAngele(e.beta);  // X'
		orientation.gamma = getAngele(e.gamma);  // Y''
		subscribers.notify(orientation);
	}

	function updateScreenOrientation() {
		orientation.orientation = getAngele(screen.orientation.angle || 0);
		subscribers.notify(orientation);
	}

	function getAngele(rawAngle) {
		return rawAngle ? THREE.Math.degToRad(rawAngle) : 0;
	}

	return {
		enable,
		disable,
		subscribe: subscribers.subscribe,
		unsubscribe: subscribers.unsubscribe
	};
}
