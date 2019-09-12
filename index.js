let request = require('ajax-request');
function getJTVideo(id) {
	if(!id) return console.log('invalid ID');
	request({
		url: '',
		method: 'GET',
		data: {
			v: id
		}
	}, function(err, res, body) {
		if(err) {
			return err;
		}
		if(body) {
		try {
			let videoDATA = json.parse(body);
			return videoDATA;
		} catch(error) {
			return error;
		}
		} else {
			return false;
		}
	});
}
module.exports = jontube;