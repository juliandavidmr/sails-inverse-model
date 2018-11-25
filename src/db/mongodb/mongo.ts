/**
 * compiler_mongo.js
 * @autor Julian David (@anlijudavid)
 * 2016
 *
 * Mysql to models waterline
 */

import mondongo from "mondongo";
import { camelize } from "underscore.string";
import { saveControllers, saveModels } from 'src/utils/save';
import { IModel } from 'src/interfaces/IModel';

var view = require('../../genviews/view');

// Connection URL var url = 'mongodb://localhost:27017/blog_db';

export function generate(host, port, database, folder_views, folder_models, folder_controllers) {
	return new Promise(function (resolve, reject) {
		exports
			.generateModels(host, port, database)
			.then((Models) => {
				console.log([
					Models.length, Models.length > 0
						? "tables"
						: 'table'
				].join(" "));

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
			}, (err) => {
				console.log(err);
				return reject(err);
			});
	});
};

export function generateModels(host, port, database) {
	return new Promise(function (resolve, reject) {
		createURL(host, port, database, function (err, connection_url) {
			if (err) return reject(err);

			var Models: IModel[] = [];
			mondongo
				.describe(connection_url)
				.then((described) => {
					described.forEach(elem => {
						if (elem.collection !== 'system.indexes' && elem.count > 0) {
							const attributes_sails: string[] = [],
								view_contents: string[] = [];
							elem
								.describe
								.forEach(item_descr => {
									var result = toSailsAttribute(item_descr.type, item_descr.key, item_descr.isID);
									attributes_sails.push(result.model_content);
									view_contents.push(result.view_content);
								});

							Models.push({
								model_name: camelize(elem.collection),
								content: "attributes: { " + (attributes_sails.join(", ")) + " }",
								view_content: view_contents
							});
						}
					});
					return resolve(Models);
				});
		});
	});
};

function createURL(host, port, database, cb) {
	if (host && port && database) {
		return cb(null, 'mongodb://' + host + ':' + port + '/' + database + '');
	} else {
		const params: string[] = [];
		if (!host) {
			params.push("host");
		}
		if (!port) {
			params.push("port");
		}
		if (!database) {
			params.push("database");
		}
		return cb("Missing parameters: " + params.join(", "), null);
	}
}

export function toSailsAttribute(type: string, name_attribute: string, isid: boolean) {
	type = type.toLowerCase().trim();

	const sails_attribute: string[] = [];
	const content_view = {
		required: false,
		default_value: undefined,
		name: name_attribute,
		type: ''
	};

	if (type == "object") {
		content_view.required = true;
		if (isid && isid === true) {
			content_view.type = "number";
			sails_attribute.push("type: 'integer'");
		} else {
			content_view.type = "text";
			sails_attribute.push("type: 'text'");
		}
	} else {
		content_view.type = type;
		sails_attribute.push("type: '" + type + "'");
	}

	var result = {
		model_content: (name_attribute.toLowerCase() + ": {" + sails_attribute.join(',') + "}"),
		view_content: JSON.stringify(content_view)
	};

	return result;
}

/*
Mondongo:
this.generate('localhost', 27017, 'blog_db').then((Models) => {
  console.log("Output:\n", JSON.stringify(Models, null, 2));
}, (error) => {
  console.log(error);
});
*/