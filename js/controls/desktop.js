import {KEY_CODES} from '../constants';
import observable from '../lib/observable';

const CURSOR_FACTOR = 0.03;
const defaultMove = {x: 0, y: 0, z: 0};

export default function desktopControls() {
	const cameraMoveSubscribers = observable();
	const cursorMoveSubscribers = observable();

	let middleButtonFlag = false;
	window.addEventListener('keydown', (e) => {
		if (e.keyCode === KEY_CODES.LEFT_ARROW) {
			cameraMoveSubscribers.notify(Object.assign({}, defaultMove, {x: -1}));
		}
		if (e.keyCode === KEY_CODES.RIGTH_ARROW) {
			cameraMoveSubscribers.notify(Object.assign({}, defaultMove, {x: 1}));
		}
		if (e.keyCode === KEY_CODES.DOWN_ARROW) {
			cameraMoveSubscribers.notify(Object.assign({}, defaultMove, {z: 1}));
		}
		if (e.keyCode === KEY_CODES.UP_ARROW) {
			cameraMoveSubscribers.notify(Object.assign({}, defaultMove, {z: -1}));
		}
	});
	window.addEventListener('mousedown', (e) => {
		if (e.which === 2) {
			middleButtonFlag = true;
		}
	});

	window.addEventListener('mouseup', (e) => {
		if (e.which === 2) {
			middleButtonFlag = false;
		}
	});

	const lastXYZ = {};
	window.addEventListener('mousemove', (e) => {
		if ('x' in lastXYZ && 'y' in lastXYZ && middleButtonFlag) {
			cursorMoveSubscribers.notify({
				x: (lastXYZ.x - e.clientX) * CURSOR_FACTOR,
				y: (lastXYZ.y - e.clientY) * CURSOR_FACTOR,
				z: 0
			});
		}
		lastXYZ.x = e.clientX;
		lastXYZ.y = e.clientY;
	});
	window.addEventListener('wheel', (e) => {
		cursorMoveSubscribers.notify(Object.assign({}, defaultMove, {
			z: e.deltaY * CURSOR_FACTOR
		}));
	});

	return {
		cameraMove: {
			subscribe: cameraMoveSubscribers.subscribe,
			unsubscribe: cameraMoveSubscribers.unsubscribe
		},
		cursorMove: {
			subscribe: cursorMoveSubscribers.subscribe,
			unsubscribe: cursorMoveSubscribers.unsubscribe
		}
	};
}
