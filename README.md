# JonTube
JonTube

Using this you will be able to get info about videos on JonTube, for example playing them etc.

Usage:
using the ?v= input do
getJTVideo(id);
and it will either return error or it will return a json
```javascript
let jontube = require('jontube');
jontube('cm45gT2v', test);
function test(thing) {
	console.log(thing);
	try {
		let JSONobj = JSON.parse(thing);
		console.log(JSONobj.n);
	} catch(error) {
		console.log(error);
	}
}
```

This is still in work :)
