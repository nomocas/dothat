import Dothat from './src/dothat';
import PromiseExtension from 'nomocas-utils/lib/promise-log';

for (const i in PromiseExtension)
	Dothat.prototype[i] = PromiseExtension[i];

Dothat.prototype.logSubject = function(title) {
	return this.then((s, subject) => {
		console.log(title || 'subject : ', subject); // eslint-disable-line no-console
		return s;
	});
};

export default Dothat;

