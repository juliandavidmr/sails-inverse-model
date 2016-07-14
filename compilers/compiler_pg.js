var plural = require('../configs/plural');
var to = require('../configs/to');

var Beautifier = require('node-js-beautify');
var b = new Beautifier();

var ProgressBar = require('progress');
var gencode = require('gencode');
var mkdir = require("mkdir-promise");
var s = require("underscore.string");

var PostgresSchema = require('pg-json-schema-export');

exports.generate = function(config, folder_models, folder_controllers, plurallang) {
	PostgresSchema.toJSON(config, config.schema)
		.then(function(schemas) {
			//console.log(JSON.stringify(schemas, null, 4));
			var Models = [];

			//Tables
			for (var table in schemas.tables) {
				//console.log("-----------------------------------------------------------");
				//console.log("Table: ", table);

				if (schemas.tables.hasOwnProperty(table)) { //confirm data of tables
					var attrs = schemas.tables[table]["columns"];
					//console.log(attrs);
					var attributes_sails = [];
					for (var attr in attrs) { // attribute of a table
						var name_attribute = attr;
						var properties_attribute = attrs[attr];
						//console.log("\n------>>", properties_attribute);
						attributes_sails.push(transpile(properties_attribute, name_attribute));
					}

					Models.push({
						model_name: plural.pluraliza(s.camelize(table), plurallang).trim(),
						content: "attributes: { " + (attributes_sails.join(",")) + " }"
					});
				}
			}

			//console.log(JSON.stringify(Models, null, 4));
			if (folder_models != "") {
				saveModels(folder_models, Models, plurallang);
			}
			if (folder_controllers != "") {
				saveControllers(folder_controllers, Models, plurallang);
			}
		})
		.catch(function(error) {
			console.log(error);
			// handle error
		});
};


/**
 * [saveModels save models in the folder Models]
 * @param  {[type]} dir_folder_model [description]
 * @param  {[type]} Models           [description]
 * @return {[type]}                  [description]
 */
function saveControllers(dir_folder_controllers, Models, plurallang) {
	var bar2 = new ProgressBar(':bar', {
		total: Models.length
	});

	mkdir(dir_folder_controllers).then(() => {
		Models.map((model) => {
			var name_c = to.capitalize(plural.pluraliza(model.model_name, plurallang)).trim() + "Controller.js";
			gencode.save(b.beautify_js(to.saveController(name_c)), dir_folder_controllers, name_c).then((value) => {
				bar2.tick();
				if (bar2.complete) {
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

/**
 * [saveModels save models in the folder Models]
 * @param  {[type]} dir_folder_model [description]
 * @param  {[type]} Models           [description]
 * @return {[type]}                  [description]
 */
function saveModels(dir_folder_model, Models, plurallang) {
	var bar = new ProgressBar(':bar', {
		total: Models.length
	});

	mkdir(dir_folder_model).then(() => {
		Models.map((model) => {
			var name_m = to.capitalize(plural.pluraliza(model.model_name, plurallang)).trim() + ".js";
			gencode.save(b.beautify_js(to.toModel(model.content)), dir_folder_model, name_m).then((value) => {
				bar.tick();
				if (bar.complete) {
					console.log('\nComplete Models.\n');
				}
			}, (err) => {
				console.log([ansi.red.open, "ERROR", err, ansi.red.close].join("\n"));
			});
		});
	}, function(ex) {
		console.error(ex);
	});
}

/**
 * [transpile convert all attributes postgres to sailsjs]
 * @param  {[type]} attributes     [description]
 * @param  {[type]} name_attribute [description]
 * @return {[type]}                [description]
 */
function transpile(attributes, name_attribute) {
	var type_ = attributes["data_type"];
	var column_name_ = attributes["column_name"];
	var default_value_ = attributes["column_default"];
	var is_nullable_ = attributes["is_nullable"];

	//console.log("TYPE:", type_);
	//console.log("COLUMN:", column_name_);
	//console.log("DEFAULT:", default_value_);

	return toSailsAttribute(type_, column_name_, default_value_, is_nullable_);
}

/**
 * [toSailsAttribute convert a attribute postgres to sailsjs]
 * @param  {[type]}  type_          [description]
 * @param  {[type]}  attrib         [description]
 * @param  {[type]}  default_value_ [description]
 * @param  {Boolean} is_nullable_   [description]
 * @return {[type]}                 [description]
 */
function toSailsAttribute(type_, attrib, default_value_, is_nullable_) {

	var sails_attribute = [];

	var sails_attribute_children = [];

	//console.log(attrib);
	if (type_.toLowerCase().indexOf('varying') > -1 ||
		type_.toLowerCase().indexOf('character') > -1) {
		sails_attribute_children.push("type: 'string'");
	} else if (type_.toLowerCase().indexOf('int') > -1 ||
		type_.toLowerCase().indexOf('small') > -1) { //Include smallint
		sails_attribute_children.push("type: 'integer'");
	} else if (type_.toLowerCase().indexOf('bool') > -1 ||
		type_.toLowerCase().indexOf('bit') > -1) {
		sails_attribute_children.push("type: 'boolean'");
	} else if (type_.toLowerCase().indexOf('float') > -1 ||
		type_.toLowerCase().indexOf('dec') > -1 || //Include decimal
		type_.toLowerCase().indexOf('numeric') > -1 ||
		type_.toLowerCase().indexOf('real') > -1 ||
		type_.toLowerCase().indexOf('precision') > -1) {
		sails_attribute_children.push('type: "float"');
	} else if (type_.toLowerCase().indexOf('enum') > -1) {
		//sails_attribute_children.push(getEnum(type_));
	} else if (type_.toLowerCase().indexOf('datetime') > -1 ||
		type_.toLowerCase().indexOf('timestamp') > -1) {
		sails_attribute_children.push("type: 'datetime'");
	} else if (type_.toLowerCase().indexOf('date') > -1) {
		sails_attribute_children.push("type: 'date'");
	} else if (type_.toLowerCase().indexOf('json') > -1) {
		sails_attribute_children.push('type: "json"');
	} else if (type_.toLowerCase().indexOf('text') > -1) {
		sails_attribute_children.push("type: 'text'");
	} else if (type_.toLowerCase().indexOf('bigint') > -1) { //Include smallint
		sails_attribute_children.push([
			"type: 'integer',",
			'size: 20'
		].join(" "));
	}

	if (default_value_ != "" && default_value_ != undefined) {
		if (!default_value_.startsWith("nextval")) { //No contains nextval
			sails_attribute_children.push("default: " + default_value_);
		}
	}

	if (is_nullable_ == "true" || is_nullable_ == true) {
		sails_attribute_children.push("required: " + true);
	} else {
		sails_attribute_children.push("required: " + false);
	}

	sails_attribute.push(attrib.toLowerCase() + ": {" + sails_attribute_children.join(',') + "}");
	//console.log(attribute);
	return sails_attribute.toString();
};


/**
 * =============================================================================
 * 															Testing
 */
/*var config = {
	user: 'postgres',
	password: 'root',
	host: 'localhost',
	port: 5432,
	database: 'almacen'
}
*/
//exports.generate(config, "any folder", "any folder 2", "en");
