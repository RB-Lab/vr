import P2P from 'socket.io-p2p';
import io from 'socket.io-client';
import startVR from './vr';
import landscape from './objects/landscape';
import line from './objects/line';
import box from './objects/box';
import mobileControls from './controls/mobile';
import setQuaternion from './controls/utils/quaterion';

const socket = io(`${window.location.protocol}//${window.location.hostname}:3050`);
const p2p = new P2P(socket);
p2p.usePeerConnection = true;


const vr = startVR();
vr.addToScene(landscape(vr.anisotropy));
vr.addToScene(line([10, 10, 0], [10, 12, 0]));
vr.addToScene(line([10, 11, -1], [10, 11, 1]));
vr.addToScene(box());

p2p.on('set-camera-orientation', (orientation) => {
	setQuaternion(vr.camera.quaternion, orientation);
});

if (isMobile()) {
	const controls = mobileControls();
	controls.enable();
	controls.subscribe((orientation) => {
		setQuaternion(vr.camera.quaternion, orientation);
		p2p.emit('set-camera-orientation', orientation);
	});
	vr.enableStereo();
} else {
	//
}
vr.resize();

function isMobile() {
	return /android/i.test(navigator.userAgent);
}
