'use strict';

var mysqldesc = require('mysqldesc');
var ProgressBar = require('progress');
var gencode = require('gencode');
var ansi = require('ansi-styles');
var mkdir = require("mkdir-promise");
var Beautifier = require('node-js-beautify');


var plural = require('../configs/plural');
var to = require('../configs/to');

var b = new Beautifier();

exports.generate = function(config, folder_models, folder_controllers, plurallang) {
	// Describe connected database
	mysqldesc(config, function(err, data) {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			var Models = [],
				cantidad = 0;
			for (var tt in data) { // tt: Name table
				Models.push(tt);
				cantidad++;
			}
			console.log([cantidad, "tables"].join(" "));

			if (folder_models) {
				var bar_models = new ProgressBar(':bar', {
					total: cantidad
				});

				mkdir(folder_models).then(function() {
					for (var table in data) { // table: Name table
						var salida = "";
						if (data.hasOwnProperty(table)) {
							//console.log(table + " = " + JSON.stringify(data[table], null, 4));
							salida = salida.concat("attributes: {");
							for (var colum in data[table]) {
								salida += exports.toSailsAttribute(data[table][colum], colum) + ", ";
							}
							salida = exports.quitComma(salida).concat("} ");
						}
						var model = salida.replace('\\', '');

						var file = to.capitalize((plural.pluraliza(table, plurallang)) + ".js");
						//console.log(file);
						gencode.save(b.beautify_js(to.toModel(model)), folder_models, file).then((value) => {
							//console.log([ansi.green.open, table + "> ", value, ansi.green.close].join(" "));
							//console.log(file);
							bar_models.tick();
							if (bar_models.complete) {
								console.log('\nComplete models.\n');
							}
						}, (err) => {
							console.log([ansi.red.open, "ERROR", err, ansi.red.close].join("\n"));
						});
					}

				}, function(ex) {
					console.error(ex);
				});
			}

			if (folder_controllers) {
				var bar = new ProgressBar(':bar', {
					total: cantidad
				});

				mkdir(folder_controllers).then(function() {
					Models.map((item, i) => { //Item name table
						//console.log("Tabla " + i + ">\n" + item);
						var name_c = to.capitalize(plural.pluraliza(item, plurallang)).trim() + "Controller.js";
						gencode.save(b.beautify_js(to.saveController(name_c, plurallang)), folder_controllers, name_c).then((value) => {
							bar.tick();
							if (bar.complete) {
								console.log('\nComplete Controllers.\n');
							}
						}, (err) => {
							console.log([ansi.red.open, "ERROR", err, ansi.red.close].join("\n"));
						});
					});
				}, function(ex) {
					console.error(ex);
				});
			}
		}
	});

};

exports.toSailsAttribute = function(prop, attrib) {
	var attribute = attrib.toLowerCase() + ": {";
	var size, type, required, primarykey, unique, autoincrement, vdefault;
	//console.log(attrib);
	if (prop.Type.toLowerCase().indexOf('varchar') > -1) {
		attribute = attribute.concat(getString(prop.Type));
	} else if (prop.Type.toLowerCase().indexOf('int') > -1 ||
		prop.Type.toLowerCase().indexOf('small') > -1) { //Include smallint
		attribute = attribute.concat(getInteger(prop.Type));
	} else if (prop.Type.toLowerCase().indexOf('bool') > -1 ||
		prop.Type.toLowerCase().indexOf('bit') > -1) {
		attribute = attribute.concat(getBoolean());
	} else if (prop.Type.toLowerCase().indexOf('float') > -1 ||
		prop.Type.toLowerCase().indexOf('dec') > -1 //Include decimal
		||
		prop.Type.toLowerCase().indexOf('numeric') > -1 ||
		prop.Type.toLowerCase().indexOf('real') > -1 ||
		prop.Type.toLowerCase().indexOf('precicion') > -1) {
		attribute = attribute.concat(getFloat());
	} else if (prop.Type.toLowerCase().indexOf('enum') > -1) {
		attribute = attribute.concat(getEnum(prop.Type));
	} else if (prop.Type.toLowerCase().indexOf('text') > -1) {
		attribute = attribute.concat(getText());
	} else if (prop.Type.toLowerCase().indexOf('datetime') > -1) {
		attribute = attribute.concat(getDateTime());
	} else if (prop.Type.toLowerCase().indexOf('date') > -1 ||
		prop.Type.toLowerCase().indexOf('year') > -1) {
		attribute = attribute.concat(getDate());
	} else if (prop.Type.toLowerCase().indexOf('datetime') > -1) {
		attribute = attribute.concat(getDateTime());
	}

	attribute = attribute.concat(", " + getOthers(prop));

	attribute = attribute.concat("}");
	//console.log(attribute);
	return attribute;
};

function getString(Type) {
	var out = [];
	var attr_aux = Type.toLowerCase().split(/[(*)]/);
	out.push('type: "string"');
	if (attr_aux[1]) {
		out.push("size: " + parseInt(attr_aux[1]));
	}
	return quitComma(out.join(","));
}

function getInteger(Type) {
	var out = [];
	var attr_aux = Type.toLowerCase().split(/[(*)]/);
	out.push('type: "integer"');
	if (attr_aux[1]) {
		out.push("size: " + parseInt(attr_aux[1]));
	}
	return quitComma(out.join(","));
}

function getFloat() {
	return 'type: "float"';
}

function getBoolean() {
	return 'type: "binary"';
}

function getText() {
	return 'type: "text"';
}

function getDate() {
	return 'type: "date"';
}

function getDateTime() {
	return 'type: "datetime"';
}

function getEnum(Type) {
	var out = [];
	var pa1 = Type.indexOf('(');
	var pa2 = Type.indexOf(')');

	pa1++;
	var line = Type.substring(pa1, pa2).replace(",", "").split('\'');
	//console.log(pa1 + ", " + pa2);
	line.map((item) => {
		if (item != "") {
			out.push('"' + item + '"');
		}
	});
	//out.push("required: true");
	return "enum: [" + quitComma(out.join(",")) + "]";
}

function getOthers(prop) {
	var out = [];

	if (prop["Key"]) {
		if (prop["Key"].toLowerCase().indexOf("pri") > -1) {
			out.push("primaryKey: true");
			out.push("unique: true");
			out.push("required: true");
		}
	}
	/*if (prop["Null"].toLowerCase().indexOf("no") > -1 || prop["Key"]) {}*/
	if (prop["Extra"].toLowerCase().indexOf("increment") > -1) {
		out.push("autoIncrement: true");
	}
	return out.join(", ");
}


function quitComma(str) {
	if (str.trim().endsWith(",")) {
		return str.trim().substr(0, str.length - 1);
	}
	return str;
}

exports.quitComma = quitComma;
