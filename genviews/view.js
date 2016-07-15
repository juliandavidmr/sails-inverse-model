var gencode = require('gencode');
var ansi = require('ansi-styles');
var mkdir = require("mkdir-promise");

require('./crud');
require('../configs/route');

exports.generate = function(Models, folder_views) {
	mkdir(folder_views).then(() => {
		Models.forEach(model => {
			var route = concat(folder_views, model.model_name);
			console.log(route);
			mkdir(route).then(() => {
				create(model.model_name, "sails-inverse-model", model).then((html) => {
					//console.log("________>_____________>_____________>>__>____________________");
					//console.log(html);
					//console.log(">", folder_views);
					gencode.save(html, route, "create.ejs").then((value) => {
						//console.log(value);
					}, (err) => {
						console.log([ansi.red.open, "ERROR", err, ansi.red.close].join("\n"));
					});
				});

				update(model.model_name, "sails-inverse-model", model).then((html) => {
					gencode.save(html, route, "update.ejs").then((value) => {
						//console.log(value);
					}, (err) => {
						console.log([ansi.red.open, "ERROR", err, ansi.red.close].join("\n"));
					});
				});

				index(model.model_name, "sails-inverse-model", model).then((html) => {
					gencode.save(html, route, "index.ejs").then((value) => {
						//console.log(value);
					}, (err) => {
						console.log([ansi.red.open, "ERROR", err, ansi.red.close].join("\n"));
					});
				});
			});
		});
	});
};


/*

var html = '<script id="header" type="text/x-handlebars-template">​<div> {{ headerTitle }} </div>​Today is {{weekDay}}​</script>';

var theData = {
	headerTitle: "Shop Page",
	weekDay: "Wednesday"
};
// Retrieve the HTML from the script tag we setup in step 1​
// We use the id (header) of the script tag to target it on the page​
var theTemplate = Handlebars.compile (html);


console.log(theTemplate(theData));
*/
