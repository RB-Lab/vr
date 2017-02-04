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
