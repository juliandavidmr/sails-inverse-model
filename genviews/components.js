var fs = require('fs');

// input.hbs
exports.layout = function(callback) {
	return read("/crud/layout.hbs", function(content) {
		callback(content);
	});
}

// create.hbs
exports.create = function(callback) {
	return read("/crud/create.hbs", function(content) {
		callback(content);
	});
}

// index.hbs
exports.index = function(callback) {
	return read("/crud/index.hbs", function(content) {
		callback(content);
	});
}

// update.hbs
exports.update = function(callback) {
	return read("/crud/update.hbs", function(content) {
		callback(content);
	});
}


//Read file hbs and return code
function read(name, callback) {
	fs.readFile(__dirname + "/" + name, 'utf8', (err, data) => {
		if (err) throw err;
		callback(data.toString());
	});
}
