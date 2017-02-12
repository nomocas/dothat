var Promise = require('../dist/dothat.js').default;
Promise.unhandledRejection = null;
module.exports = {
	resolved: Promise.resolve,
	rejected: Promise.reject,
	deferred: function() {
		var def = {},
			p = new Promise(function(resolve, reject) {
				def.resolve = resolve;
				def.reject = reject;
			});
		def.promise = p;
		return def;
	}
};

