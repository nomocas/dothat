/* global describe, it */
import Dothat from '../src/dothat.js';
import chai from 'chai';

chai.should();

describe('Dothat catch', () => {

	const p = Dothat.reject(new Error('boum')).catch((e) => {
		return { message: e.message };
	});

	it('should catch error', () => {
		return p.then((s) => {
			s.should.deep.equals({ message: 'boum' });
		});
	});
});

describe('Dothat all', () => {

	const p = Dothat.resolve('bam').all([Dothat.resolve(true), Dothat.resolve(1)]);

	it('should receive both value', () => {
		return p.then((s) => {
			s.should.deep.equals([true, 1]);
		});
	});
});

describe('Dothat race', () => {

	const p = Dothat.resolve('bam').race([Dothat.resolve(true), Dothat.resolve(1)]);

	it('should receive first value', () => {
		return p.then((s) => {
			s.should.equal(true);
		});
	});
});

describe('Dothat extends and Cl.resolve', () => {

	const MyDothat = Dothat.extends(Dothat, {
		myLexem(title) {
			return this.then((s, subject) => {
				subject.title = title;
			});
		}
	});

	const subject = {},
		p = MyDothat.resolve(true, subject).myLexem('foo');

	it('should have set value in subject', () => {
		return p.then((s, subject) => {
			subject.should.deep.equals({ title: 'foo' });
		});
	});
});
describe('Dothat extends with no api and Cl.resolve', () => {

	const MyDothat = Dothat.extends();

	MyDothat.prototype.myLexem = function(title) {
		return this.then((s, subject) => {
			subject.title = title;
		});
	};

	const subject = {},
		p = MyDothat.resolve(true, subject).myLexem('foo');

	it('should have set value in subject', () => {
		return p.then((s, subject) => {
			subject.should.deep.equals({ title: 'foo' });
		});
	});
});
describe('Dothat extends and Cl.reject', () => {
	const MyDothat = Dothat.extends(Dothat);

	const subject = {},
		p = MyDothat.reject(new Error('boum'), subject).catch((e, subject) => subject.error = e.message);

	it('should have set value in subject', () => {
		return p.then((s, subject) => {
			subject.should.deep.equals({ error: 'boum' });
		});
	});
});
describe('Dothat unhandle rejection', () => {

	it('should catch error', () => {
		let resolve;
		const result = {},
			p = new Dothat((res) => { resolve = res; });
		Dothat.unhandledRejection = function(e) {
			result.unhandled = e.message;
			resolve(result);
		};
		Dothat.reject(new Error('boum'));

		return p.then((s) => {
			s.should.deep.equals({ unhandled: 'boum' });
		});
	});
});

