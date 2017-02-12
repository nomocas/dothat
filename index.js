const Dothat = require('./lib/dothat'),
	PromiseExtension = require('nomocas-utils/lib/promise-log');

Object.assign(Dothat.prototype, PromiseExtension);

Dothat.prototype.logSubject = function(title) {
	return this.then((s, subject) => {
		console.log(title || 'subject : ', subject); // eslint-disable-line no-console
		return s;
	});
};

export default Dothat;

