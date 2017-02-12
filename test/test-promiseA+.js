var promisesAplusTests = require('promises-aplus-tests'),
	adapter = require('./dothat-adapter');

promisesAplusTests(adapter, function(err) {
	console.log('test err : ', err);
	// All done; output is in the console. Or check `err` for number of failures.
});

