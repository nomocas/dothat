import Promise from '../src/dothat.js';
Promise.unhandledRejection = null;
export default {
	resolved: Promise.resolve,
	rejected: Promise.reject,
	deferred() {
		const def = {},
			p = new Promise((resolve, reject) => {
				def.resolve = resolve;
				def.reject = reject;
			});
		def.promise = p;
		return def;
	}
};

