#!/usr/bin/env node

'use strict';

var meow = require('meow');
var ansi = require('ansi-styles');

require('./configs/color');
require('./configs/route');

var compiler_my = require('./compilers/mysql/compiler_mysql');
var compiler_pg = require('./compilers/compiler_pg');
var transpilefile = require('./compilers/mysql/compiler_sqlfile_mysql');
var exitsfile = require('is-existing-file');

var cli = meow([
	color("                .-..-.																		      ", "blue"),
	"																																							",
	color("Sails", "yellow") + color("-inverse", "blue") + color("-model", "red") + color("    <|    .-..-.	v. 1.1.4                 ", "green"),
	color("                        |\																	   ", "green"),
	color("        ~    ~   ~     /|.\ 																   ", "green"),
	color("           ~  ~       / || \																   ", "green"),
	color("             ~  ~   ,'  |'  \															   ", "green"),
	color("                 .-'.-==|/_--'															   ", "green"),
	color("                 `--'-------' 															   ", "green"),
	color("    __--___--___---___---___--___---___--___      					   ", "blue"),
	color("  ____---___--___---___--___---___--___-__---___      				 ", "blue"),
	" 																																						",
	" -----------------------------------------------------------------						",
	" :: " + (new Date()) + "																	",
	" -----------------------------------------------------------------						",
	'Example:',
	'  $ mkdir sails-output',
	'  $ cd sails-output',
	'  $ sails-inverse-model -u postgres -p root -d almacen -t pg -m -v -c',
	'',
	'User         : postgres',
	'Password     : root',
	'Database     : almacen',
	'Host         : localhost',
	'Pluralize    : No pluralize',
	'Models       : /home/julian/Documents/sails-output/models',
	'Views        : /home/julian/Documents/sails-output/views',
	'Controllers  : /home/julian/Documents/sails-output/controllers',
	'DB           : pg',
	'Schema (pg)  : public',
	'=====================================',
	'Complete views.',
	'=====================================',
	'Complete Models.',
	'=====================================',
	'Complete Controllers.',
	'',
	'    Note: Copy models      => your/project_sails/api',
	'          Copy controllers => your/project_sails/api',
	'          Copy views/*     => your/project_sails/views/',
	' Then: ',
	' $ cd your/project_sails/',
	' $ sails lift',
	'',
	' More info: https://github.com/juliandavidmr/sails-inverse-model',
	" -----------------------------------------------------------------						",
	'Options',
	'  -u, --user         User of database',
	'  -p, --pass         Password of database',
	'  -d, --database     Database name',
	'  -h, --host         Host server                Default: localhost',
	'  -m, --models       Folder output models       Default: Folder actual',
	'  -c, --controllers  Folder output controllers  Default: Folder actual',
	'  -v, --views        Folder output views        Default: Folder actual ' + color('(Experimental)', 'yellow'),
	'  -l, --lang         Pluralize models and controllers: es|en|fr     Default: no pluralize',
	'  -t, --type         Type gestor database: mysql|postgres|mongodb   Default: mysql',
	'  -s, --schema       Schema of database postgres: Default: public (Only PostgreSQL)',
	'  -f, --file         .sql file location entry (Only MySQL)' + color(" NEW", "blue") + color(' (Experimental)', 'yellow'),
	//'	 -i, --intelligen  Detects your attributes of type passwords and mail: y|n Default: n'
	//'  --neez  Type of word: yes|no|all  Default: all',
]);

//console.log(cli);

var user,
	pass,
	db,
	host,
	port,
	folder_models,
	folder_controllers,
	folder_views,
	plurallang,
	schema,
	type,
	intelligen,
	filesql;

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
if (plurallang == true || plurallang == "true") {
	plurallang = undefined;
}

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
	folder_models = concat(process.cwd(), "models"); // Method concat: see configs/route.js
}

//Folder Controllers
folder_controllers = cli.flags.c || cli.flags.controllers;
if (folder_controllers == true || folder_controllers == "true") {
	folder_controllers = concat(process.cwd(), "controllers"); // Method concat: see configs/route.js
}

//Folder views
folder_views = cli.flags.v || cli.flags.views;
if (folder_views == true || folder_views == "true") {
	folder_views = concat(process.cwd(), "views"); // Method concat: see configs/route.js
}

//file .sql
filesql = cli.flags.f || cli.flags.file;
if (filesql == true || filesql == "true") {
	filesql = undefined; // Method concat: see configs/route.js
}

//Intelligen
intelligen = cli.flags.i || cli.flags.intelligen;

if (filesql) {
	console.log("Pluralize    :", color((plurallang || "Not generate"), "green"));
	console.log("Models       :", color((folder_models || "Not generate"), "green"));
	console.log("Views        :", color((folder_views || "Not generate."), "green"));
	console.log("Controllers  :", color((folder_controllers || "Not generate"), "green"));
	console.log("File (script):", color((filesql || "Not used"), "green"));
	exitsfile(filesql, function(exits) {
		if (exits) {
			transpilefile.generate(filesql, folder_models, folder_controllers, folder_views, plurallang);
		} else {
			console.log(color("\nERROR: No exits '" + filesql + "'. \nEnter 'sails-inverse-model --help'", "red"));
		}
	});
} else if (db && pass && user && host) {
	console.log("User         :", color(user, "green"));
	console.log("Password     :", color(pass, "green"));
	console.log("Database     :", color(db, "green"));
	console.log("Host         :", color(host, "green"));
	console.log("Pluralize    :", color((plurallang || "Not generate"), "green"));
	console.log("Models       :", color((folder_models || "Not generate"), "green"));
	console.log("Views        :", color((folder_views || "Not generate."), "green"));
	console.log("Controllers  :", color((folder_controllers || "Not generate"), "green"));
	console.log("DB           :", color((type), "green"));
	console.log("Schema (pg)  :", color((schema), "green"));

	// Mysql & postgres connect config.
	var config = {
		user: user,
		password: pass,
		host: host,
		database: db,
		schema: schema,
		port: 3306
	};

	if (folder_controllers || folder_models || folder_views) {
		type = type.toLowerCase(); //pg, postgres, mysql
		if (type.indexOf("pg") != -1 || type.indexOf("postgres") != -1) { //pg, postgres
			config.port = 5432;
			compiler_pg.generate(config, folder_models, folder_controllers, folder_views, plurallang);
		} else if (type.indexOf("mg") != -1 || type.indexOf("mongo") != -1) { //my, mysql

		} else { //my, mysql
			delete config.schema;
			compiler_my.generate(config, folder_models, folder_controllers, folder_views, plurallang);
		}
	} else {
		console.log("\nPress:\t", ansi.yellow.open + "sails-inverse-model --help" + ansi.yellow.close);
	}
} else {
	console.log([ansi.yellow.open, "ERROR", "Missing parameters: enter 'sails-inverse-model --help'", ansi.yellow.close].join("\n"));
}
