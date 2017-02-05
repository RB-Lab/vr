import observable from './lib/observable';
import {CONTAINER_ID} from './constants';

const camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const updateListeners = observable();
let effect = null;
let element = null;
let container = null;
let render = null;

/**
 * starts VR (or 3D) scene
 * @return {VrScene}
 */
function startVR() {
	element = renderer.domElement;
	container = document.getElementById(CONTAINER_ID);
	container.appendChild(element);
	camera.position.set(0, 10, 0);
	scene.add(camera);
	render = () => renderer.render(scene, camera);
	animate();

	/**
	 * @type VrScene
	 */
	return {
		/**
		 * @param {Array<Object3D>|Object3D} objects
		 */
		addToScene(objects) {
			if (Array.isArray(objects)) {
				objects.forEach((obj) => {
					scene.add(obj);
				});
			} else {
				scene.add(objects);
			}
		},
		resize() {
			const width = container.offsetWidth;
			const height = container.offsetHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize(width, height);
			if (effect) {
				effect.setSize(width, height);
			}
		},
		enableStereo() {
			effect = new THREE.StereoEffect(renderer);
			render = () => effect.render(scene, camera);
		},
		addUpdateListener: updateListeners.subscribe,
		removeUpdateListener: updateListeners.unsubscribe,
		anisotropy: renderer.getMaxAnisotropy(),
		container,
		element,
		camera
	};
}

function animate() {
	requestAnimationFrame(animate);
	camera.updateProjectionMatrix();
	updateListeners.notify();
	render();
}

export default startVR;
