export default function line(a, b) {
	const material = new THREE.LineBasicMaterial({color: 0x00ff00});
	const geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(...roundVector(a)));
	geometry.vertices.push(new THREE.Vector3(...roundVector(b)));
	const newLine = new THREE.Line(geometry, material);
	return {
		line: newLine,
		update(newA, newB) {
			newLine.geometry.vertices[0].set(...roundVector(newA));
			newLine.geometry.vertices[1].set(...roundVector(newB));
			newLine.geometry.computeLineDistances();
			newLine.geometry.verticesNeedUpdate = true;
		}
	};
}

function roundVector(coords) {
	return [
		Math.round(coords.x),
		Math.round(coords.y),
		Math.round(coords.z)
	];
}
