export default function line(a, b) {
	const material = new THREE.LineBasicMaterial({color: 0x00ff00});
	const geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(...a));
	geometry.vertices.push(new THREE.Vector3(...b));
	return new THREE.Line(geometry, material);
}
