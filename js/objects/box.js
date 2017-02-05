export default function box() {
	const geometry = new THREE.BoxGeometry(3, 3, 3);
	const texture = new THREE.TextureLoader().load(
		'textures/patterns/checker.png'
	);

	const material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 20,
		shading: THREE.FlatShading,
		map: texture
	});
	const boxMesh = new THREE.Mesh(geometry, material);
	boxMesh.translateOnAxis(new THREE.Vector3(10, 5, 0), 1);
	boxMesh.rotateY(15);
	return boxMesh;
}
