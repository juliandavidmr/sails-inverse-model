#!/usr/bin/env node

'use strict';

var meow = require('meow');
var ansi = require('ansi-styles');

var compiler_my = require('./compilers/compiler_mysql');
var compiler_pg = require('./compilers/compiler_pg');

var cli = meow([
	'Examples',
	'  $ sails-inverse-model --help',
	'  ...',
	'',
	'  $ sails-inverse-model -u root -p root -d independiente -m -c -l es',
	'User:	 root',
	'Password: root',
	'Database: independiente',
	'Host:	 localhost',
	'Pluralize:	 No pluralize',
	'Models:	 /home/julian/Documentos/sailsproject/api/models',
	'Controllers:	 /home/julian/Documentos/sailsproject/api/controllers',
	'9 tables',
	'=========',
	'Complete models.',
	'=========',
	'Complete Controllers.',
	'',
	'Options',
	'  -u, --user  User of database',
	'  -p, --pass  Password of database',
	'  -d, --database	Database name',
	'  -h, --host	Host server 	Default: localhost',
	'  -m, --models	Folder output models	Default: Folder actual',
	'  -c, --controllers	Folder output	controllers Default: Folder actual',
	'  -l, --lang  Pluralize models and controllers: es|en|fr  Default: no pluralize',
	'  -t, --type  Type gestor database: mysql|postgres  Default: mysql',
	'  -s, --schema  Schema of database postgres: Default: public (Only PostgreSQL)',
	//'  --neez  Type of word: yes|no|all  Default: all',
]);

var user, pass, db, host, port, folder_models, plurallang, folder_controllers, schema, type;

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

//Type gestor database mysql | postgres
type = cli.flags.t || cli.flags.type || "mysql";
if (type == true || type == "true") {
	type = "mysql";
}

//Schema database postgres
schema = cli.flags.s || cli.flags.schema || "public";
if (schema == true || schema == "true") {
	schema = "public";
}


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
	console.log("Pluralize:", ansi.green.open + (plurallang || "No pluralize") + ansi.green.close);
	console.log("Models:\t", ansi.green.open + (folder_models || "No generated") + ansi.green.close);
	console.log("Controllers:", ansi.green.open + (folder_controllers || "No generated") + ansi.green.close);
	console.log("DB:\t", ansi.green.open + (type) + ansi.green.close);
	console.log("Schema (pg):", ansi.green.open + (schema) + ansi.green.close);

	// Mysql connect config.
	var config = {
		user: user,
		password: pass,
		host: host,
		database: db,
		schema: schema,
		port: 3306
	};

	if(folder_controllers || folder_models) {
		schema = schema.toLowerCase();
		if (schema.indexOf("pg") > -1 || schema.indexOf("postgres") > -1) {
			config.port = 5432;
			compiler_pg.generate(config, folder_models, folder_controllers, plurallang);
		} else {
			delete config.schema;
			compiler_my.generate(config, folder_models, folder_controllers, plurallang);
		}
	} else {
		console.log("\nPress:\t", ansi.yellow.open + "sails-inverse-model --help" + ansi.yellow.close);
	}
} else {
	console.log([ansi.yellow.open, "ERROR", "Missing parameters: enter 'sails-inverse-model --help'", ansi.yellow.close].join("\n"));
}
