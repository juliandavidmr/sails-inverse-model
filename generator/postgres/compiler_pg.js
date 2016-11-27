/**
 * compiler_mysql.js
 * @autor Julian David (@anlijudavid)
 * 2016
 *
 * Process mysql to models waterline
 */
var ProgressBar = require('progress');
var s = require("underscore.string");

var to = require('../../configs/to');
var view = require('../../genviews/view');
require('../save');

var PostgresSchema = require('pg-json-schema-export');

exports.generate = function(config, folder_models, folder_controllers, folder_views) {
	PostgresSchema.toJSON(config, config.schema)
		.then(function(schemas) {
			//console.log(JSON.stringify(schemas, null, 4));
			var Models = [];

			//Tables
			for (var table in schemas.tables) {
				//console.log("Table: ", table);

				if (schemas.tables.hasOwnProperty(table)) { //confirm data of tables
					var attrs = schemas.tables[table]["columns"];
					//console.log(attrs);
					var attributes_sails = [], view_contents = [];
					for (var attr in attrs) { // attributes of a table
						if (attrs.hasOwnProperty(attr)) { // attr => name of attribute
							//console.log("\n------>>", properties_attribute);
							var result = transpile(attrs[attr]);
							attributes_sails.push(result.model_content);
							view_contents.push(result.view_content);
						}
					}

					//console.log(view_content);
					Models.push({
						model_name:s.camelize(table).trim(),
						content: "attributes: { " + (attributes_sails.join(", ")) + " }",
						view_content: view_contents
					});
				}
			}

			/*for (var constraint in schemas.constraints) {
				console.log(JSON.stringify(constraint));
			}*/

			console.log([Models.length, "tables"].join(" "));
			//console.log(JSON.stringify(Models, null, 4));

			if (folder_models !== "" && folder_models) {
				saveModels(folder_models, Models);
			}
			if (folder_controllers !== "" && folder_controllers) {
				saveControllers(folder_controllers, Models);
			}
			if (folder_views !== "" && folder_views) {
				view.generate(Models, folder_views);
			}
		})
		.catch(function(error) {
			console.log(error);
			// handle error
		});
};

/**
 * [transpile: convert all attributes postgres to sailsjs]
 * @param  {[type]} attributes     [description]
 * @return {[type]}                [description]
 */
function transpile(attributes) {
	var type_ = attributes["data_type"];
	var column_name_ = attributes["column_name"];
	var default_value_ = attributes["column_default"];
	var is_nullable_ = attributes["is_nullable"];

	//console.log(JSON.stringify(attributes));
	return toSailsAttribute(type_, column_name_, default_value_, is_nullable_);
}

/**
 * [toSailsAttribute convert a attribute postgres to sailsjs]
 * @param  {string}  type_          [type object: varying, bigint...]
 * @param  {string}  attrib         [name of attribute: mail, id, pet...]
 * @param  {string}  default_value_ [value for default: if boolean --> default: false | true]
 * @param  {Boolean} is_nullable_   [required?]
 * @return {string}                 [result; attribute sailsjs]
 */
function toSailsAttribute(type_, attrib, default_value_, is_nullable_) {
	var sails_attribute_children = [];
	var content_view = {
		required: (is_nullable_ == "true" || is_nullable_ === true),
		default_value: undefined,
		name: attrib,
		type: undefined
	};

	//console.log(attrib);
	if (type_.toLowerCase().indexOf('varying') > -1 ||
		type_.toLowerCase().indexOf('character') > -1) {
		sails_attribute_children.push("type: 'string'");
		content_view.type = "text";
	} else if (type_.toLowerCase().indexOf('int') > -1 ||
		type_.toLowerCase().indexOf('small') > -1) { //Include smallint
		sails_attribute_children.push("type: 'integer'");
		content_view.type = "number";
	} else if (type_.toLowerCase().indexOf('bool') > -1 ||
		type_.toLowerCase().indexOf('bit') > -1) {
		sails_attribute_children.push("type: 'boolean'");
		content_view.type = "checkbox";
	} else if (type_.toLowerCase().indexOf('float') > -1 ||
		type_.toLowerCase().indexOf('dec') > -1 || //Include decimal
		type_.toLowerCase().indexOf('numeric') > -1 ||
		type_.toLowerCase().indexOf('real') > -1 ||
		type_.toLowerCase().indexOf('precision') > -1) {
		sails_attribute_children.push('type: "float"');
		content_view.type = "number";
	} else if (type_.toLowerCase().indexOf('enum') > -1) {
		//sails_attribute_children.push(getEnum(type_));
	} else if (type_.toLowerCase().indexOf('datetime') > -1 ||
		type_.toLowerCase().indexOf('timestamp') > -1) {
		sails_attribute_children.push("type: 'datetime'");
		content_view.type = "datetime";
	} else if (type_.toLowerCase().indexOf('date') > -1) {
		sails_attribute_children.push("type: 'date'");
		content_view.type = "date";
	} else if (type_.toLowerCase().indexOf('json') > -1) {
		sails_attribute_children.push('type: "json"');
		content_view.type = "textarea";
	} else if (type_.toLowerCase().indexOf('text') > -1) {
		sails_attribute_children.push("type: 'text'");
	} else if (type_.toLowerCase().indexOf('bigint') > -1) { //Include smallint
		sails_attribute_children.push([
			"type: 'integer',",
			'size: 20'
		].join(" "));
		content_view.type = "number";
	}

	if (default_value_ !== "" && default_value_ !== null) {
		default_value_ = default_value_ + "";
		if (!default_value_.startsWith("nextval")) { //No contains nextval
			sails_attribute_children.push("default: " + default_value_);
			content_view.default_value = default_value_;
		}
	}

	if (is_nullable_ == "true" || is_nullable_ === true) {
		sails_attribute_children.push("required: " + true);
	} else {
		sails_attribute_children.push("required: " + false);
	}

	//console.log("=>=>=>=>>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>>=>=>=>");
	//console.log(JSON.stringify(content_view));

	var result = {
		model_content: (attrib.toLowerCase() + ": {" + sails_attribute_children.join(',') + "}"),
		view_content: JSON.stringify(content_view)
	};

	//console.log("==>",result.model_content);
	return result;
}

function foreignkeys(constraints) {

}
