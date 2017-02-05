import setObjectQuaternion from './helpers/quaterion';

// TODO make orientation observable, then subscribe camera on it and send it via p2p

export default function orientationControls(camera) {
	camera.rotation.reorder('YXZ');
	let deviceOrientation = {};
	let screenOrientation = 0;
	let enabled = false;

	function onDeviceOrientationChange(event) {
		deviceOrientation = event;
	}

	function onScreenOrientationChange() {
		screenOrientation = window.orientation || 0;
	}

	function connect() {
		onScreenOrientationChange(); // run once on load
		window.addEventListener('orientationchange', onScreenOrientationChange, false);
		window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
		enabled = true;
	}

	function disconnect() {
		window.removeEventListener('orientationchange', onScreenOrientationChange, false);
		window.removeEventListener('deviceorientation', onDeviceOrientationChange, false);
		enabled = false;
	}

	function update() {
		if (enabled === false) return;
		const alpha = getAngele(deviceOrientation.alpha);  // Z;
		const beta = getAngele(deviceOrientation.beta); // X';
		const gamma = getAngele(deviceOrientation.gamma); // Y'';
		const orient = getAngele(screenOrientation); // O

		setObjectQuaternion(camera.quaternion, alpha, beta, gamma, orient);
	}

	function getAngele(rawAngle) {
		return rawAngle ? THREE.Math.degToRad(rawAngle) : 0;
	}

	connect();

	return {
		connect,
		update,
		disconnect
	};
}
