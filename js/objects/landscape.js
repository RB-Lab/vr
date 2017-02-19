function star() {
	const starLight = new THREE.PointLight(0xffffff, 1.4, 2800);
	starLight.position.set(300, 300, -900);
	window.star = starLight;
	return starLight;
}

function skyDome() {
	const geometry = new THREE.SphereGeometry(300, 300, 300);
	const material = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('textures/skybox/sky3.jpg')
	});
	const mesh = new THREE.Mesh(geometry, material);
	mesh.material.side = THREE.DoubleSide;
	return mesh;
}

function surface(anisotropy) {
	const texture = new THREE.TextureLoader().load(
		'textures/patterns/sand.png'
	);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat = new THREE.Vector2(90, 90);
	texture.anisotropy = anisotropy;

	const material = new THREE.MeshLambertMaterial({
		color: 0xffffff,
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
		skyDome(),
		surface(anisotropy)
	];
}
