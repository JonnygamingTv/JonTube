var request = require('ajax-request');
/* example usage:
let jontube = require('jontube');
jontube('cm45gT2v', console.log);
*/
function getJTVideo(id, callback) {
	if(!id) return console.log('no ID provided');
	if(!callback) return console.log("can't callback..");
	request({
		url: 'https://JonTube.com/getvideo.php',
		method: 'GET',
		data: {
			v: id
		}
	}, function(err, res, body) {
		if(err) {
			return callback(err);
		}
		return callback(body);
	});
}
getJTVideo.getuser = function(id, callback) {
	if(!id) return console.log('no ID provided');
	if(!callback) return console.log("can't callback..");
	request({
		url: 'https://JonTube.com/getuser.php',
		method: 'GET',
		data: {
			id: id
		}
	}, function(err, res, body) {
		if(err) {
			return callback(err);
		}
		return callback(body);
	});
}
module.exports = getJTVideo;
