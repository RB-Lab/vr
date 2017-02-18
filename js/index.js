import P2P from 'socket.io-p2p';
import io from 'socket.io-client';
import NoSleep from 'nosleep.js';
import startVR from './vr';
import landscape from './objects/landscape';
import box from './objects/box';
import line from './objects/line';
import mobileControls from './controls/mobile';
import desktopControls from './controls/desktop';
import setQuaternion from './controls/utils/quaterion';
import fullscreen from './controls/utils/fullscreen';

const noSleep = new NoSleep();
const socket = io(`${window.location.protocol}//${window.location.hostname}:3050`);
const p2p = new P2P(socket);
p2p.usePeerConnection = true;

const vr = startVR();
const object = box();
const terrain = landscape(vr.anisotropy);
vr.addToScene(terrain);
vr.addToScene(object);


p2p.on('set-camera-orientation', (orientation) => {
	setQuaternion(vr.camera.quaternion, orientation);
});
p2p.on('move-camera', moveCamera);
p2p.on('move-cursor', moveCursor);

if (isMobile()) {
	const controls = mobileControls();
	controls.enable();
	controls.subscribe((orientation) => {
		setQuaternion(vr.camera.quaternion, orientation);
		p2p.emit('set-camera-orientation', orientation);
	});
	vr.enableStereo();
	vr.container.addEventListener('click', () => {
		fullscreen(vr.container);
		noSleep.enable();
	});
} else {
	const controls = desktopControls();
	controls.cameraMove.subscribe((move) => {
		moveCamera(move);
		p2p.emit('move-camera', move);
	});
	controls.cursorMove.subscribe((move) => {
		moveCursor(move);
		p2p.emit('move-cursor', move);
	});
}

function moveCamera(move) {
	vr.camera.translateX(move.x);
	vr.camera.translateY(move.y);
	vr.camera.translateZ(move.z);
	updateLaserPosition();
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let laser = null;
const cameraShift = {x: 0, y: -1, z: -1};
function moveCursor(move) {
	mouse.x = move.x;
	mouse.y = move.y;
	updateLaserPosition();
}

function updateLaserPosition() {
	raycaster.setFromCamera(mouse, vr.camera);
	const inte = raycaster.intersectObjects(terrain);
	if (inte.length) {
		if (!laser) {
			laser = line(shiftIt(vr.camera.position, cameraShift), inte[0].point);
			window.laser = laser;
			vr.addToScene(laser.line);
		} else {
			laser.update(shiftIt(vr.camera.position, cameraShift), inte[0].point);
		}
	}
}

function shiftIt(position, shift) {
	return {
		x: position.x + shift.x,
		y: position.y + shift.y,
		z: position.z + shift.z
	};
}

vr.resize();
window.addEventListener('resize', vr.resize);

function isMobile() {
	return /android/i.test(navigator.userAgent);
}
