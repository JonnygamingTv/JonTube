# JonTube
JonTube

Using the npm package will make you able to easily use the website to get info etc.
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
jontube.getuser('rK9JTIdB2eqsEkWQ', test);
```

This is still in work :)
