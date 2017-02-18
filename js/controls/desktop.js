import {KEY_CODES} from '../constants';
import observable from '../lib/observable';

const CURSOR_FACTOR = 0.03;
const defaultMove = {x: 0, y: 0, z: 0};

export default function desktopControls() {
	const cameraMoveSubscribers = observable();
	const cursorMoveSubscribers = observable();

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

	const lastXYZ = {};
	window.addEventListener('mousemove', (e) => {
		cursorMoveSubscribers.notify({
			x: ((e.clientX / window.innerWidth) * 2) - 1,
			y: -((e.clientY / window.innerHeight) * 2) + 1
		});
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
