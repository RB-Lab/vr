import observable from '../lib/observable';


export default function mobileControls() {
	const orientationSubscribers = observable();
	const orientation = {
		alpha: 0,
		beta: 0,
		gamma: 0,
		orientation: 0
	};

	function enable() {
		window.addEventListener('orientationchange', updateScreenOrientation);
		window.addEventListener('deviceorientation', updateDeviceOrientation);
	}

	function disable() {
		window.removeEventListener('orientationchange', updateScreenOrientation);
		window.removeEventListener('deviceorientation', updateDeviceOrientation);
	}

	function updateDeviceOrientation(e) {
		orientation.alpha = getAngele(e.alpha);  // Z
		orientation.beta = getAngele(e.beta);  // X'
		orientation.gamma = getAngele(e.gamma);  // Y''
		orientationSubscribers.notify(orientation);
	}

	function updateScreenOrientation() {
		orientation.orientation = getAngele(screen.orientation.angle || 0);
		orientationSubscribers.notify(orientation);
	}

	function getAngele(rawAngle) {
		return rawAngle ? THREE.Math.degToRad(rawAngle) : 0;
	}

	return {
		enable,
		disable,
		subscribe: orientationSubscribers.subscribe,
		unsubscribe: orientationSubscribers.unsubscribe
	};
}
