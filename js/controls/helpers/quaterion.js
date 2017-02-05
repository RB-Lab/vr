// !!! DISCALMER: UNKNOWN MATH !!! // http://bit.ly/2jQatfy

// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
const zee = new THREE.Vector3(0, 0, 1);
const euler = new THREE.Euler();
const q0 = new THREE.Quaternion();
// - PI/2 around the x-axis
const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

export default function setObjectQuaternion(quaternion, alpha, beta, gamma, orient) {
	// 'ZXY' for the device, but 'YXZ' for us
	euler.set(beta, alpha, -gamma, 'YXZ');
	// orient the device
	quaternion.setFromEuler(euler);
	// camera looks out the back of the device, not the top
	quaternion.multiply(q1);
	// adjust for screen orientation
	quaternion.multiply(q0.setFromAxisAngle(zee, -orient));
}
