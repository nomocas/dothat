import Dothat from './dothat';
import promiseExtension from 'nomocas-utils/lib/promise-log';

promiseExtension(Dothat);

Dothat.prototype.logSubject = function(title) {
	return this.then((s, subject) => {
		console.log(title || 'subject : ', subject); // eslint-disable-line no-console
		return s;
	});
};

export default Dothat;

