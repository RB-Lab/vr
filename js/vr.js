const env = {
	clock: new THREE.Clock(),
	camera: new THREE.PerspectiveCamera(90, 1, 0.001, 700),
	scene: new THREE.Scene(),
	renderer: new THREE.WebGLRenderer(),
	effect: null,
	controls: null,
	element: null,
	container: null,
	render: null,
	isMobile: checkForMobile()
};

function startVR() {
	env.element = env.renderer.domElement;
	env.container = document.getElementById('example');
	env.container.appendChild(env.element);
	if (env.isMobile) {
		env.effect = new THREE.StereoEffect(env.renderer);
		env.render = () => env.effect.render(env.scene, env.camera);
		window.addEventListener('deviceorientation', setOrientationControls, true);
	}
	env.camera.position.set(0, 10, 0);
	env.controls = createOrbitControls(env.camera, env.element);
	window.addEventListener('resize', resize, false);
	setTimeout(resize, 1);
	env.scene.add(env.camera);
	animate();

	return {
		/**
		 * @param {Array<Object3D>|Object3D} objects
		 */
		addToScene(objects) {
			if (Array.isArray(objects)) {
				objects.forEach((obj) => {
					env.scene.add(obj);
				});
			} else {
				env.scene.add(objects);
			}
		},
		anisotropy: env.renderer.getMaxAnisotropy()
	};
}

function setOrientationControls(e) {
	if (!e.alpha) {
		return;
	}
	env.controls = createOrientationControls(env.camera);
	env.element.addEventListener('click', fullscreen, false);
	window.removeEventListener('deviceorientation', setOrientationControls, true);
}

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

function createOrientationControls(camera) {
	const controls = new THREE.DeviceOrientationControls(camera, true);
	controls.connect();
	controls.update();
	return controls;
}

function checkForMobile() {
	return /android/i.test(navigator.userAgent);
}

function resize() {
	const width = env.container.offsetWidth;
	const height = env.container.offsetHeight;

	env.camera.aspect = width / height;
	env.camera.updateProjectionMatrix();

	env.renderer.setSize(width, height);
	if (env.effect) {
		env.effect.setSize(width, height);
	}
}

function update(dt) {
	resize();
	env.camera.updateProjectionMatrix();
	env.controls.update(dt);
}

function render() {
	if (env.effect) {
		env.effect.render(env.scene, env.camera);
	} else {
		env.renderer.render(env.scene, env.camera);
	}
}

function animate() {
	requestAnimationFrame(animate);
	update(env.clock.getDelta());
	render(env.clock.getDelta());
}

function fullscreen() {
	if (env.container.requestFullscreen) {
		env.container.requestFullscreen();
	} else if (env.container.msRequestFullscreen) {
		env.container.msRequestFullscreen();
	} else if (env.container.mozRequestFullScreen) {
		env.container.mozRequestFullScreen();
	} else if (env.container.webkitRequestFullscreen) {
		env.container.webkitRequestFullscreen();
	}
}


export default startVR;
