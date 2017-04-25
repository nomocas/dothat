/* global describe */
import promisesAplusTests from 'promises-aplus-tests';
import adapter from './dothat-adapter';

describe('Promises/A+ Tests', () => {
	promisesAplusTests.mocha(adapter);
});

