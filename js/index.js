(function() {
	const env = {
		clock: new THREE.Clock(),
		camera: new THREE.PerspectiveCamera(45, 9 / 16, 1, 100),
		scene: new THREE.Scene(),
		renderer: new THREE.WebGLRenderer(),
		effect: null,
		controls: null,
		element: null,
		container: null,
		render: null,
		isMobile: checkForMobile()
	};
	let spaceFlag = false;

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
	setTimeout(resize, 1);
	env.scene.add(env.camera);
	env.scene.add(drawLandscape(env.renderer));
	env.scene.add(drawLine([10, 10, 0], [10, 12, 0]));
	env.scene.add(drawLine([10, 11, -1], [10, 11, 1]));
	env.scene.add(new THREE.HemisphereLight(0x999999, 0x000000, 0.6));
	env.scene.add(box);
	animate();

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

	function drawLandscape(renderer) {
		const texture = THREE.ImageUtils.loadTexture(
			'textures/patterns/checker.png'
		);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat = new THREE.Vector2(90, 90);
		texture.anisotropy = renderer.getMaxAnisotropy();

		const material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			specular: 0xffffff,
			shininess: 20,
			shading: THREE.FlatShading,
			map: texture
		});

		const geometry = new THREE.PlaneGeometry(1000, 1000);

		const landscapeMesh = new THREE.Mesh(geometry, material);
		landscapeMesh.rotation.x = -Math.PI / 2;
		return landscapeMesh;
	}

	function drawLine(a, b) {
		const material = new THREE.LineBasicMaterial({color: 0x00ff00});
		const geometry = new THREE.Geometry();
		const line = new THREE.Line(geometry, material);
		geometry.vertices.push(new THREE.Vector3(...a));
		geometry.vertices.push(new THREE.Vector3(...b));
		return line;
	}

	function drawBox() {
		const geometry = new THREE.BoxGeometry(3, 3, 3);
		const texture = THREE.ImageUtils.loadTexture(
			'textures/patterns/checker.png'
		);

		const material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			specular: 0xffffff,
			shininess: 20,
			shading: THREE.FlatShading,
			map: texture
		});
		const box = new THREE.Mesh(geometry, material);
		window.box = box;
		box.translateOnAxis(new THREE.Vector3(10, 5, 0), 1);
		box.rotateY(15);
		return box;
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
})();
