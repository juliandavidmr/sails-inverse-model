/**
 * compiler_mysql.js
 * @autor Julian David (@anlijudavid)
 * 2016
 *
 * Process mysql to models waterline
 */

'use strict';

var mysqldesc = require('mysqldesc');
var ProgressBar = require('progress');
var gencode = require('gencode');
var ansi = require('ansi-styles');
var mkdir = require("mkdir-promise");
var Beautifier = require('node-js-beautify');
var s = require("underscore.string");

var plural = require('../configs/plural');
var to = require('../configs/to');
var view = require('../genviews/view');

var b = new Beautifier();
require('./save');

exports.generate = function(config, folder_models, folder_controllers, folder_views, plurallang) {
	// Describe connected database
	mysqldesc(config, function(err, data) {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			var Models = [];

			for (var table in data) { // table: Name table
				if (data.hasOwnProperty(table)) {
					//console.log(table + " = " + JSON.stringify(data[table], null, 4));
					var attributes_sails = [], view_contents = [];
					for (var colum in data[table]) {
						var attributes = data[table][colum];
						var result = transpile(attributes, colum);
						view_contents.push(result.view_content);
						attributes_sails.push(result.model_content);
					}
				}

				Models.push({
					model_name: plural.pluraliza(s.camelize(table), plurallang).trim(),
					content: "attributes: { " + (attributes_sails) + " }",
					view_content: view_contents
				});
			}

			console.log([Models.length, "tables"].join(" "));

			//console.log(Models);

			if (folder_views != "" && folder_views) {
				view.generate(Models, folder_views);
			}
			if (folder_models != "" && folder_models) {
				saveModels(folder_models, Models, plurallang);
			}
			if (folder_controllers != "" && folder_controllers) {
				saveControllers(folder_controllers, Models, plurallang);
			}
		}
	});
};

/**
 * [transpile: convert all attributes postgres to sailsjs]
 * @param  {[type]} attributes     [description]
 * @param  {[type]} name_attribute [description]
 * @return {[type]}                [description]
 */
function transpile(attributes, name_attribute) {
	//console.log(attributes);
	var type_ = attributes["Type"];
	var default_value_ = attributes["default"];
	var is_nullable_ = attributes["Null"];

	//console.log(JSON.stringify(attributes));

	//console.log("TYPE:", type_);
	//console.log("COLUMN:", column_name_);
	//console.log("DEFAULT:", default_value_);

	return toSailsAttribute(type_, name_attribute, default_value_, is_nullable_);
}

function toSailsAttribute(Type, attrib, default_value_, is_nullable_) {
	var content_view = {
		required: true,
		default_value: default_value_,
		name: attrib,
		type: undefined
	};
	//console.log(attrib);
	var attribute = [];
	if (Type.toLowerCase().indexOf('varchar') > -1 ||
		Type.toLowerCase().indexOf('time') > -1) {
		attribute.push(getString(Type));
		content_view.type = "text";
	} else if (Type.toLowerCase().indexOf('int') > -1 ||
		Type.toLowerCase().indexOf('small') > -1) { //Include smallint
		attribute.push(getInteger(Type));
		content_view.type = "number";
	} else if (Type.toLowerCase().indexOf('bool') > -1 ||
		Type.toLowerCase().indexOf('bit') > -1) {
		attribute.push(getBoolean());
		content_view.type = "checkbox";
	} else if (Type.toLowerCase().indexOf('float') > -1 ||
		Type.toLowerCase().indexOf('dec') > -1 || //Include decimal
		Type.toLowerCase().indexOf('numeric') > -1 ||
		Type.toLowerCase().indexOf('real') > -1 ||
		Type.toLowerCase().indexOf('precicion') > -1) {
		attribute.push(getFloat());
		content_view.type = "number";
	} else if (Type.toLowerCase().indexOf('enum') > -1) {
		attribute.push(getEnum(Type));
		content_view.type = "text";
	} else if (Type.toLowerCase().indexOf('text') > -1) {
		attribute.push(getText());
		content_view.type = "text";
	} else if (Type.toLowerCase().indexOf('datetime') > -1) {
		attribute.push(getDateTime());
		content_view.type = "datetime";
	} else if (Type.toLowerCase().indexOf('date') > -1 ||
		Type.toLowerCase().indexOf('year') > -1) {
		attribute.push(getDate());
		content_view.type = "date";
	}

	//console.log(attribute);
	var result = {
		model_content: (attrib.toLowerCase() + ": {" + attribute.join(',') + "}"),
		view_content: JSON.stringify(content_view)
	}
	return result;
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

function quitComma(str) {
	if (str.trim().endsWith(",")) {
		return str.trim().substr(0, str.length - 1);
	}
	return str;
}

exports.quitComma = quitComma;
