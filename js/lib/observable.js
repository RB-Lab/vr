export default function observable() {
	const subscribers = [];

	return {
		/**
		 * @param {Function} listener
		 */
		subscribe(subscriber) {
			subscribers.push(subscriber);
		},
		/**
		 * @param {Function} listener
		 */
		unsubscribe(subscriber) {
			const index = subscribers.indexOf(subscriber);
			subscribers.splice(index, 1);
		},
		notify(e) {
			subscribers.forEach((subscriber) => {
				subscriber(e);
			});
		}
	};
}
