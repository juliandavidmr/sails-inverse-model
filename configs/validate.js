/**
 * [validate description]
 * @param  {[type]} path [description]
 * @param  {[type]} mode [description]
 * @return {[type]}      [description]
 */

var pathExists = require('path-exists');

validate = function(path, mode, cb) {
	if (typeof mode == 'string') {
		if (typeof path == 'string') {
			if (mode.toLocaleString().indexOf('force') != -1) { //mode force, create folder if no exits
				pathExists(path).then((exists) => {
					//=> true | false
					console.log(exists);
				});
			}
		}
	}
}

validate("/", "force");
