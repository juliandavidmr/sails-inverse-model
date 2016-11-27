var scanner = require('../../scanners/scanner_mysql');
var compiler_mysql = require('./compiler_mysql');
var view = require('../../genviews/view');
var to = require('../../configs/to');
var s = require("underscore.string");
require('../save');

exports.generate = function(pathsql, folder_models, folder_controllers, folder_views) {
	this.createModels(pathsql, function(err, Models) {
		//console.log(JSON.stringify(Models, null, 2));
		if (folder_views !== "" && folder_views) {
			view.generate(Models, folder_views);
		}
		if (folder_models !== "" && folder_models) {
			saveModels(folder_models, Models);
		}
		if (folder_controllers !== "" && folder_controllers) {
			saveControllers(folder_controllers, Models);
		}
	});
};

exports.createModels = function(pathsql, cb) {
	scanner.generate(pathsql, function(err, described) {
		if (err) {
			cb(err, null);
		} else {
			var Models = [];
			described.map((table, i) => {
				//console.log(table);
				var attributes_sails = [],
					view_contents = [];
				table.atr.map((attr) => {
					var transp = transpile(attr);
					attributes_sails.push(transp.model_content);
					view_contents.push(transp.view_content);
				});

				Models.push({
					model_name: s.camelize(table.table_name),
					content: "attributes: { " + (attributes_sails.join(", ")) + " }",
					view_content: view_contents
				});
			});
			cb(null, Models);
		}
	});
};

function transpile(attributes) {
	//console.log("attributes " + JSON.stringify(attributes, null, 4));
	var type_ = attributes["Type"];
	var is_nullable_ = attributes["NotNull"];
	var size_ = attributes["Size"];
	var ai_ = attributes["AI"];
	var name_ = attributes["Name"];

	//console.log(JSON.stringify(attributes));
	return compiler_mysql.toSailsAttribute(type_, name_, null, is_nullable_);
}

/*
{
   "table_name": "tipo_notificacion",
   "atr": [
     {
       "Name": "tntf_idtiponotif",
       "Type": "int",
       "Size": "11",
       "NotNull": true,
       "AI": true
     },
     {
       "Name": "tntf_nombre",
       "Type": "varchar",
       "Size": "45",
       "NotNull": true,
       "AI": false
     },
     {
       "Name": "tntf_descripcion",
       "Type": "text",
       "Size": "",
       "NotNull": true,
       "AI": false
     }
   ]
 },
 ...
*/
