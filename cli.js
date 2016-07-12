#!/usr/bin/env node

'use strict';

var meow = require('meow');
var mysqldesc = require('mysqldesc');
var gencode = require('gencode');
var ansi = require('ansi-styles');
var ProgressBar = require('progress');
var plural = require('./configs/plural');
var Beautifier = require('node-js-beautify');
var b = new Beautifier();
var compiler = require('./compilers/compiler_mysql');
var mkdir = require("mkdir-promise");

var cli = meow([
	'Examples',
	'  $ sails-inverse-model --help',
	'  ...',
	'',
	'  $ sails-inverse-model -u root -p root -d independiente -m -c',
	'  User:	 root',
	'  Password: root',
	'  Database: dbname',
	'  Host:	 localhost',
	'  Output folder:	 /home/julian/Documentos/Node_Projects/sails-inverse-model/test/api',
	'  53 tables',
	'  ===============================================================================================',
	'  ',
	'  complete',
	'  ...',
	'',
	'Options',
	'  -u, --user  User of mysql',
	'  -p, --pass  Password of mysql',
	'  -d, --database	Database of mysql',
	'  -h, --host	Host server mysql		Default: localhost',
	'  -m, --models	Folder output models	Default: Folder actual',
	'  -c, --controllers	Folder output	controllers Default: Folder actual',
	'  -l, --lang  Pluralize models and controllers: es|en|fr  Default: no pluralize',
	//'  --neez  Type of word: yes|no|all  Default: all',
	//'  --neez  Type of word: yes|no|all  Default: all',
]);

var user, pass, db, host, port, folder_models, plurallang, folder_controllers;

//User mysql
if (cli.flags.u || cli.flags.user) {
	user = cli.flags.u || cli.flags.user;
}

//Password
if (cli.flags.p || cli.flags.pass) {
	pass = (cli.flags.p || cli.flags.pass).toString();
}

//Database
db = cli.flags.d || cli.flags.database;

//Host of Mysql
host = cli.flags.h || cli.flags.host || "localhost";

plurallang = cli.flags.l || cli.flags.lang;

//Folder output
folder_models = cli.flags.m || cli.flags.models;
if (folder_models == true || folder_models == "true") {
	folder_models = (process.cwd()) + "/models";
}

folder_controllers = cli.flags.c || cli.flags.controllers || (process.cwd())
if (folder_controllers == true || folder_controllers == "true") {
	folder_controllers = (process.cwd() + "/controllers")
}

if (db && pass && user && host) {

	console.log("User:\t", ansi.green.open + user + ansi.green.close);
	console.log("Password:", ansi.green.open + pass + ansi.green.close);
	console.log("Database:", ansi.green.open + db + ansi.green.close);
	console.log("Host:\t", ansi.green.open + host + ansi.green.close);
	console.log("Pluralize:\t", ansi.green.open + (plurallang || "No pluralize") + ansi.green.close);
	console.log("Models:\t", ansi.green.open + folder_models + ansi.green.close);
	console.log("Controllers:\t", ansi.green.open + folder_controllers + ansi.green.close);

	// Mysql connect config.
	var config = {
		user: user,
		password: pass,
		host: host,
		database: db
	};

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
			//console.log(">",cantidad);
			var bar = new ProgressBar(':bar', {
				total: cantidad
			});

			if (folder_models) {
				mkdir(folder_models).then(function() {
					for (var table in data) { // table: Name table
						var salida = "";
						if (data.hasOwnProperty(table)) {
							//console.log(table + " = " + JSON.stringify(data[table], null, 4));
							salida = salida.concat("attributes: {");
							for (var colum in data[table]) {
								salida += compiler.toSailsAttribute(data[table][colum], colum) + ", ";
							}
							salida = compiler.quitComma(salida).concat("} ");
						}
						var model = salida.replace('\\', '');

						var file = capitalize((plural.pluraliza(table, plurallang)) + ".js");
						//console.log(file);
						gencode.save(b.beautify_js(toModel(model)), folder_models, file).then((value) => {
							//console.log([ansi.green.open, table + "> ", value, ansi.green.close].join(" "));
							//console.log(file);
							bar.tick();
							if (bar.complete) {
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
				mkdir(folder_controllers).then(function() {
					Models.map((item, i) => {
						//console.log("Tabla " + i + ">\n" + item);
						createController(item);
					});
				}, function(ex) {
					console.error(ex);
				});
			}
		}
	});
} else {
	console.log([ansi.yellow.open, "ERROR", "Missing parameters: enter 'sails-inverse-model --help'", ansi.yellow.close].join("\n"));
}

/**
 * [toModel simple json to model sails]
 * @param  {[type]} model_basic [description]
 * @return {[string]}             [string]
 */
function toModel(model_basic) {
	var out = [];
	out.push("/**");
	out.push("\tGenerated by sails-inverse-model");
	out.push("\tDate:" + (new Date()));
	out.push("*/\n");
	out.push("module.exports = {");
	out.push(model_basic);
	out.push("};");
	return out.join("\n");
}

function createController(name) {
	var name_c = capitalize(plural.pluraliza(name, plurallang)).trim() + "Controller.js";

	var content = [];
	content.push("/**");
	content.push("* " + name_c);
	content.push("*");
	content.push("* @description :: Server-side logic for managing " + name);
	content.push("* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers");
	content.push("*/");
	content.push("module.exports = {");
	content.push("");
	content.push("};");

	gencode.save(b.beautify_js((content.join("\n"))), folder_controllers, name_c).then((value) => {
		console.log([ansi.green.open, name_c, "created", value, ansi.green.close].join(" "));
	}, (err) => {
		console.log([ansi.red.open, "ERROR", err, ansi.red.close].join("\n"));
	});
}

function capitalize(word) {
	return word.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
		return p1 + p2.toUpperCase();
	})
}
