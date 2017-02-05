let spaceFlag = false;
window.addEventListener('keydown', (e) => {
	if (e.keyCode === 32) {
		spaceFlag = true;
	}
});
window.addEventListener('keyup', (e) => {
	if (e.keyCode === 32) {
		spaceFlag = false;
	}
});

const box = drawBox();
const lastXY = {x: 0, y: 0};
window.addEventListener('mousemove', (e) => {
	if (lastXY.x !== undefined && lastXY.y !== undefined && spaceFlag) {
		box.translateX((lastXY.x - e.clientX) * 0.03);
		box.translateZ((lastXY.y - e.clientY) * 0.03);
	}
	lastXY.x = e.clientX;
	lastXY.y = e.clientY;
});

function createOrbitControls(camera, element) {
	const controls = new THREE.OrbitControls(camera, element);
	controls.target.set(
		camera.position.x + 1,
		camera.position.y,
		camera.position.z
	);
	controls.noZoom = true;
	controls.noPan = true;
	return controls;
}

const controls = createOrbitControls(env.camera, env.element);
window.addEventListener('resize', resize, false);
setTimeout(resize, 1);
