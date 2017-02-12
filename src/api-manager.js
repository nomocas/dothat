const assert = require('assert'); // removable with unassert

import Dothat from './dothat';

export default function apiManager(holder, Class) {
	assert(Class instanceof Dothat, 'apiManager(holder, Class) need a Dothat Class (or subclass) as second argument');

	holder = holder || {};

	Object.assign(holder, {
		apis: {},
		getApi(name) {
			assert(typeof name === 'string', "apiManager.getApi(...) need a string (an Api name) as argument");

			const Class = this.apis[name];
			if (!Class)
				throw new Error('No Lexicon found with : ', name);
			return Class;
		},
		registerApi(Subclass, name) {
			assert(Subclass.prototype instanceof Class, 'apiManager.register need a Dothat subclass as first argument');
			assert(typeof name === 'string', "apiManager.register need a string (an Api name) as second argument");

			this.apis[name] = Subclass;
			return this;
		},
		createApi(name, api) {
			assert(typeof name === 'string', "apiManager.create need a string (an Api name) as first argument");
			assert(!api || typeof api === 'object', "apiManager.create need a valid object (optional) as second argument");

			return this.registerApi(Dothat.extends(Class, api), name);
		},
		extendsApi(baseApiName, newName, api) {
			assert(typeof baseApiName === 'string', "apiManager.create need a string (the Api name to extends) as first argument");
			assert(typeof newName === 'string', "apiManager.create need a string (the new Api name) as second argument");
			assert(!api || typeof api === 'object', "apiManager.create need a valid object (optional) as third argument");

			return this.registerApi(Dothat.extends(this.get(baseApiName), api), newName);
		}
	});

	return holder;
}


/**
 * Usage
 */
/*
// mydsl-familly-manager.js
import Dothat from './dothat';
import apiManager from './api-manager';

const MyDSLFamilly = Dothat.extends(Dothat, {
	myMethod:function(myarg){
		return this.then(function(s){
			return s + myArg;
		});
	},
	//...
});

export default apiManager(MyDSLFamilly);


// my-sub-dsl.js
import MyDSLFamilly from './mydsl-family-manager';

export default MyDSLFamilly.create('my-sub-dsl', {
	myOtherMethod:function(arg){
		return this.then(function(s, subject){
			return s + arg;
		});
	}
});


// third file 

import MyDSLFamilly from './mydsl-family-manager';
import MySubDSL from './my-sub-dsl';

const init = MyDSLFamilly.init;

init('my-sub-dsl', mySubject, myFirstValue)
.myMethod(...)
.myOtherMethod(...)
.log('foo');
 */

