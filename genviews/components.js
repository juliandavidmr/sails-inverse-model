var fs = require('fs');
require('../configs/route');

// content create.hbs
exports.create = function(callback) {
	return read("/crud/create.hbs", function(content) {
		callback(content);
	});
}

// content index.hbs
exports.index = function(callback) {
	return read("/crud/index.hbs", function(content) {
		callback(content);
	});
}

// content update.hbs
exports.edit = function(callback) {
	return read("/crud/edit.hbs", function(content) {
		callback(content);
	});
}

// content show.hbs
exports.show = function(callback) {
	return read("/crud/show.hbs", function(content) {
		callback(content);
	});
}

//Read file hbs and return code
function read(name, callback) {
	fs.readFile(concat(__dirname, name), 'utf8', (err, data) => {
		if (err) throw err;
		callback(data.toString());
	});
}
