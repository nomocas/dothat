/**
 * Dothat : A little bit more than Promise.
 * 
 * Extendable Promise A+ base class with "subject" forwarding through second arguments (at constructor, Dothat.resolve, Dothat.reject and .then's handler(s)).
 *
 * Despite this "second argument" mecanism, a Dothat passes all A+ tests and so could be returned anywhere a promise A+ is needed.
 * 
 * It's aimed to be used as base class for Facade-with-Method-Chaining DSL where there is (potential) async management while execution.
 * 
 * The second argument is the subject behind the facade.
 * 
 * @example
 * // simple example of direct Dothat prototype extension
 * Dothat.prototype.myMethod = function(arg1, arg2, ...){
 * 		return this.then(function(success, subject){
 * 			// do wathever you want with arg1, arg2, ... and success (the Promise piped value)
 * 			// on subject
 * 		});
 * };
 *
 * Dothat.resolve("my first success", mySubject)
 * .myMethod(true, "arg2_value", ...)
 * .then(...)
 *
 * @example
 * // Dothat derivated class
 * var MyDSL = Dothat.extends(Dothat, {
 * 		myMethod : function(arg1, arg2, ...){
 * 			return this.then(function(success, subject){
 * 				// do wathever you want with arg1, arg2, ... and success (the Promise piped value)
 * 			 	// on subject
 * 		   	});
 *       }
 * });
 *
 * MyDSL.resolve("my first success", mySubject)
 * .myMethod(true, ...) 
 * .then(...)
 *
 * MyExtendedDSL = Dothat.extends(MyDSL, ...);
 * ...
 *
 * @example
 *
 * const MyDSL = Dothat.extends(Dothat, {
 * 	myLexem:function(myArg){
 * 		return this.then(function(s, subject){
 * 			return s + myArg;
 * 		});
 * 	}
 * });
 * var mydsl = function(subject, s = null){
 * 	return MyDSL.resolve(s, subject);
 * }
 * mydsl(mySubject, 1).myLexem(2).log('result');
 * 
 */

const asap = require('asap/raw');
const assert = require('assert'); // removable with unassert

const PENDING = 1,
	FULFILLED = 2,
	REJECTED = 3;

function noop() {}

export default class Dothat {

	constructor(resolver, subject /* Dothat addition : link subject to Promise */ ) {

		assert(typeof this === 'object', 'Dothat must be constructed via new');
		assert(typeof resolver === 'function', 'Dothat should be initialize with a function');

		this._state = PENDING;
		this._deferreds = [];
		this._subject = subject; // Dothat addition : storing locally the subject
		this._handled = false; // eventual unhandle rejection flag
		if (resolver !== noop)
			resolver((value) => {
				fulfill(this, value);
			}, (reason) => {
				doReject(this, reason);
			});
	}

	then(onResolve, onReject) {
		const p = new(this.constructor)(noop, this._subject /* Dothat addition : forward subject */ );
		switch (this._state) {
			case PENDING:
				this._deferreds.push({
					onResolve,
					onReject,
					p
				});
				break;
			case FULFILLED:
				resolveChild(this, onResolve, p);
				break;
			case REJECTED:
				rejectChild(this, onReject, p);
				break;
		}
		return p;
	}

	catch (onReject) {
		return this.then(null, onReject);
	}

	// Dothat addition : inline .all and .race method (useful because facade)
	all(arr) {
		return this.then(() => {
			return Promise.all(arr);
		});
	}

	race(arr) {
		return this.then(() => {
			return Promise.race(arr);
		});
	}

	static resolve(value, subject /* dothat addition : resolve with subject to link */ ) {
		return new Dothat((resolve) => {
			resolve(value);
		}, subject);
	}

	static reject(reason, subject /* dothat addition : reject with subject to link */ ) {
		return new Dothat((resolve, reject) => {
			reject(reason);
		}, subject);
	}

	static unhandledRejection(reason) {
		if (typeof console !== 'undefined' && console)
			console.warn('Possible Unhandled Dothat Rejection:', reason); // eslint-disable-line no-console
	}

	static extends(BaseClass, methods) {
		BaseClass = BaseClass || Dothat;
		const Cl = function(resolver, subject) {
			BaseClass.call(this, resolver, subject);
		};
		Cl.prototype = Object.create(BaseClass.prototype);
		Cl.prototype.constructor = Cl;
		Cl.resolve = Dothat.resolve;
		Cl.reject = Dothat.reject;
		
		if (methods)
			Object.assign(Cl.prototype, methods);
		return Cl;
	}
}

function resolveChild(parent, onResolve, p) {
	parent._handled = true; // block eventual unhandle rejection
	typeof onResolve === 'function' ? execAndForward(parent, onResolve, p) : fulfill(p, parent._value);
}

function rejectChild(parent, onReject, p) {
	parent._handled = true; // block eventual unhandle rejection
	typeof onReject === 'function' ? execAndForward(parent, onReject, p) : doReject(p, parent._value);
}

function fulfill(p, value) {
	if (p._state !== PENDING)
		return;
	if (value === p) {
		doReject(p, new TypeError('trying to resolve Dothat with itself'));
		return;
	}
	const valueType = typeof value;
	if (value && (valueType === 'object' || valueType === 'function') && manageMaybeThenable(p, value))
		return;
	transition(p, value, FULFILLED);
}

Dothat.fulfill = fulfill;

function doReject(p, reason) {
	if (p._state === PENDING)
		transition(p, reason, REJECTED);
}

function transition(p, value, state) {
	p._state = state;
	p._value = value;
	if (state === REJECTED && !p._deferreds.length && Dothat.unhandledRejection) {
		// eventual unhandle rejection check
		asap(() => {
			if (!p._handled)
				Dothat.unhandledRejection(p._value);
		});
	} else
		p._deferreds.forEach((d) => { // execute queue 
			state === REJECTED ? rejectChild(p, d.onReject, d.p) : resolveChild(p, d.onResolve, d.p);
		});
	p._deferreds = null;
}

function manageMaybeThenable(p, thenable) {
	let called = false,
		then;
	try {
		then = thenable.then;
		if (typeof then === 'function') {
			then.call(thenable, (s) => {
				if (called) return;
				called = true;
				fulfill(p, s);
			}, (e) => {
				if (called) return;
				called = true;
				doReject(p, e);
			});
			return true;
		}
	} catch (e) {
		if (!called) {
			called = true;
			doReject(p, e);
		}
		return true;
	}
	return false;
}

function execAndForward(parent, handler, p) {
	asap(() => {
		let r;
		try {
			r = handler(parent._value, parent._subject /* Dothat addition : forward subject as second handler's arg */ );
		} catch (e) {
			doReject(p, e);
			return;
		}
		fulfill(p, r);
	});
}
