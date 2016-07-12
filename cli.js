#!/usr/bin/env node

'use strict';

var meow = require('meow');
var ansi = require('ansi-styles');

var compiler = require('./compilers/compiler_mysql');

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

//Pluralize
plurallang = cli.flags.l || cli.flags.lang;

//Folder output
folder_models = cli.flags.m || cli.flags.models;
if (folder_models == true || folder_models == "true") {
	if (require('is-os').isWindows()) {
		folder_models = (process.cwd()) + "\\models";
	} else {
		folder_models = (process.cwd()) + "/models";
	}
}

folder_controllers = cli.flags.c || cli.flags.controllers;
if (folder_controllers == true || folder_controllers == "true") {
	if (require('is-os').isWindows()) {
		folder_controllers = (process.cwd() + "\\controllers")
	} else {
		folder_controllers = (process.cwd() + "/controllers")
	}
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

	compiler.generate(config, folder_models, folder_controllers, plurallang);
} else {
	console.log([ansi.yellow.open, "ERROR", "Missing parameters: enter 'sails-inverse-model --help'", ansi.yellow.close].join("\n"));
}
