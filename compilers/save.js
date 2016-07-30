var ProgressBar = require('progress');
var plural = require('../configs/plural');
var to = require('../configs/to');
require('../configs/color');

var gencode = require('gencode');
var mkdir = require("mkdir-promise");
var s = require("underscore.string");

var Beautifier = require('node-js-beautify');
var b = new Beautifier();

/**
 * [save models in the folder Models]
 * @param  {[type]} dir_folder_controllers [path folder]
 * @param  {[type]} Models                 [array json]
 * @param  {[type]} plurallang             [pluralize]
 * @return {void}                        [none]
 */
saveControllers = function(dir_folder_controllers, Models, plurallang) {
	var bar2 = new ProgressBar(':bar', {
		total: Models.length
	});

	mkdir(dir_folder_controllers).then(() => {
		Models.map((model) => {
			var name_c = to.capitalize(plural.pluraliza(model.model_name, plurallang)).trim() + "Controller.js";
			gencode.save(b.beautify_js(to.saveController(s.camelize(model.model_name))), dir_folder_controllers, name_c).then((value) => {
				bar2.tick();
				if (bar2.complete) {
					console.log('Controllers ' + color("[OK]", "green"));
				}
			}, (err) => {
				console.warn([ansi.red.open, "ERROR", err, ansi.red.close].join("\n"));
			});
		});
	}, function(ex) {
		console.error(ex);
	});
};

/**
 * [saveModels save models in the folder Models]
 * @param  {string} dir_folder_model [description]
 * @param  {array of models: {model_name & content}} Models           [Array of models postgres]
 */
saveModels = function(dir_folder_model, Models, plurallang) {
	var bar = new ProgressBar(':bar', {
		total: Models.length
	});

	//console.log(Models);
	mkdir(dir_folder_model).then(() => {
		Models.map((model) => {
			//console.log(model);
			var name_m = to.capitalize(plural.pluraliza(model.model_name, plurallang)).trim() + ".js";
			gencode.save(b.beautify_js(to.toModel(model.content)), dir_folder_model, name_m).then((value) => {
				bar.tick();
				if (bar.complete) {
					console.log('Models ' + color("[OK]", "green"));
				}
			}, (err) => {
				console.error(color(err, "red"));
			});
		});
	}, function(ex) {
		console.error(color(ex, "red"));
	});
};