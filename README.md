<a href="https://promisesaplus.com/"><img src="https://promisesaplus.com/assets/logo-small.png" align="right" /></a>
# Dothat.js

Promise-Based Behavioural Facade DSL tools.

- Extendable Promise A+ compliant base Class
- aimed to define "Driver DSLs"
- which allow to pilot easily complex behavioural object
- by mixing Facade Method Chaining and Promises pipe pattern
- written in ES6 (avaiable in oth bes5 and es6)

Final aim is to provide easy Facade tools that hide technical details and/or targets inhomogeneities behind well choosed abstract DSLs.
It's the little sister of [Babelute.js](https://github.com/nomocas/babelute).

Lighweight (2.0 Ko minified gzipped) and so useful.

It has to be seen through Domain Specific Multi-Modeling (DSMM) Approach, where every logical level from business domain to technologies domains are encouraged to be describe by DSLs.


## Usage

```javascript
// simple example of direct Dothat prototype extension
Dothat.prototype.myMethod = function(arg1, arg2, ...){
		return this.then(function(success, subject){
			// do wathever you want with arg1, arg2, ... and success (the Promise piped value)
			// on subject
		});
};
Dothat.resolve("my first success", mySubject)
	.myMethod(true, "arg2_value", ...)
	.then(...)
```


```javascript
// Dothat derivated class
var MyDSL = Dothat.extends(Dothat, {
		myMethod : function(arg1, arg2, ...){
			return this.then(function(success, subject){
				// do wathever you want with arg1, arg2, ... and success (the Promise piped value)
			 	// on subject
		   	});
      }
});
MyDSL.resolve("my first success", mySubject)
	.myMethod(true, /*...*/) 
	.then(/*...*/)
MyExtendedDSL = Dothat.extends(MyDSL, /*...*/);
//...
```

```javascript
const MyDSL = Dothat.extends(Dothat, {
	myLexem:function(myArg){
		return this.then(function(s, subject){
			return subject.title = s;
		});
	}
});
const mydsl = MyDSL.resolve,
	subject = { title:'bar' };

mydsl(1, subject).myLexem('goo').log('result'); // result : "goo	"

// subject = { title:'goo'}

//...
```

```javascript
const AppDSL = Dothat.extends(Dothat, {
	login(email, pass){ 
		return this.then(function(s, app){
			return myClient.post(app.baseURI + '...', { email, pass })
		})
		.then(function(s, app){
			app.loggedIn = true;
			app.session.userId = s.userId;
			app.session.token = s.token;
			app.session.save();
			return true;
		});
	},
	logout(){
		return this.then(/*...*/);
	},
	register(email){
		return this.then(/*...*/);
	},
	route(route){
		return this.then(/*...*/);
	},
	email(opt){
		return this.then(/*...*/);
	}
	//...
});

function app(myApp){ 
	return AppDSL.resolve(null, myApp);
}

app(myApp)
	.login('foo@bar.com', '12345')
	.route('/my/state')
	.log('result')
	.catch((e, appli) => {
		return app(appli).email({ /*...*/ });
	});

```
## Remarque on ES6 class extension

You could use ES6 style of Classes definition but there willbe

## Licence

The [MIT](http://opensource.org/licenses/MIT) License

Copyright 2016-2017 (c) Gilles Coomans <gilles.coomans@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
