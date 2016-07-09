#!/usr/bin/env node

'use strict';

var meow = require('meow');
var mysqldesc = require('mysqldesc');

var yesNoWords = require('./');

var cli = meow([
	'Examples',
	'  $ sails-inverse-model',
	'  Yisss',
	'',
	'  $ sails-inverse-model --helall --type yes',
	'  Absolutely',
	'  Affirmative',
	'  ...',
	'',
	'Options',
	'  -u, --user  User of mysql',
	'  -p, --pass  Password of mysql',
	'  -d, --database	Database of mysql',
	'  -h, --host	Host server mysql		Default: localhost',
	'  --type  Type of word: yes|no|all  Default: all',
	'  --neez  Type of word: yes|no|all  Default: all',
]);

//var type = cli.flags.type || 'all';

var user, pass, db, host;

if (cli.flags.u || cli.flags.user) {
	user = cli.flags.u || cli.flags.user;
}

if (cli.flags.p || cli.flags.pass) {
	pass = cli.flags.p || cli.flags.pass;
}

if (cli.flags.d || cli.flags.database) {
	db = cli.flags.d || cli.flags.database;
}

if (cli.flags.h || cli.flags.host) {
	host = cli.flags.h || cli.flags.host;
} else {
	host = "localhost";
}


console.log("User: ", user);
console.log("Password: ", pass);
console.log("Database: ", db);
console.log("Host: ", host);

if (db && pass && user && host) {
	// Mysql connect config.
	var config = {
		user: user,
		password: pass,
		host: host,
		database: db
	};

	// Desc connected database
	mysqldesc(config, function(err, data) {
		if (err) {
			console.log("ERROR: ", err);
		} else {
			console.log("structure=" + JSON.stringify(data, null, 4));			
		}
	});
}

if (cli.flags.nee) {
	console.log(cli.flags.nee);
	console.log(yesNoWords['nee'].join('\n'));
}

//console.log(cli.flags.all ? yesNoWords[type].join('\n') : yesNoWords[type + 'Random'].join('\n'));
