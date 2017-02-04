function star() {
	const starLight = new THREE.PointLight(0xffffff, 1.4, 2800);
	starLight.position.set(300, 300, -900);
	window.star = starLight;
	return starLight;
}

function skyBox() {
	// Load the skybox images and create list of materials
	const materials = [
		createMaterial('textures/skybox/skyX55+x.png'), // right
		createMaterial('textures/skybox/skyX55-x.png'), // left
		createMaterial('textures/skybox/skyX55+y.png'), // top
		createMaterial('textures/skybox/skyX55-y.png'), // bottom
		createMaterial('textures/skybox/skyX55+z.png'), // back
		createMaterial('textures/skybox/skyX55-z.png')  // front
	];
	// Create a large cube
	const skyBoxMesh = new THREE.Mesh(
		new THREE.BoxGeometry(800, 800, 800, 1, 1, 1),
		new THREE.MeshFaceMaterial(materials)
	);
	// Set the x scale to be -1, this will turn the cube inside out
	skyBoxMesh.scale.set(-1, 1, 1);
	return skyBoxMesh;
}

function createMaterial(path) {
	const texture = THREE.ImageUtils.loadTexture(path);
	const material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
	return material;
}

function surface(anisotropy) {
	const texture = THREE.ImageUtils.loadTexture(
		'textures/patterns/sand.png'
	);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat = new THREE.Vector2(90, 90);
	texture.anisotropy = anisotropy;

	const material = new THREE.MeshLambertMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 20,
		shading: THREE.FlatShading,
		map: texture
	});

	const geometry = new THREE.PlaneGeometry(1000, 1000);
	const surfaceMesh = new THREE.Mesh(geometry, material);
	surfaceMesh.rotation.x = -Math.PI / 2;
	return surfaceMesh;
}

export default function createLadscapeObjects(anisotropy) {
	return [
		star(),
		new THREE.AmbientLight(0x505050),
		skyBox(),
		surface(anisotropy)
	];
}
