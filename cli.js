#!/usr/bin/env node

'use strict';

var meow = require('meow');
var ansi = require('ansi-styles');
var assert = require('assert');

require('./configs/color');
require('./configs/route');

var generate_my_transpile = require('./generator/mysql/compiler_sqlfile_mysql');
var generate_my = require('./generator/mysql/compiler_mysql');
var generate_pg = require('./generator/postgres/compiler_pg');
var generate_mg = require('./generator/mongodb/compiler_mongo');

var exitsfile = require('is-existing-file');
var message = require('./message');

var cli = meow(message.message);

var user,
  pass,
  db,
  host,
  port,
  folder_models,
  folder_controllers,
  folder_views,
  schema,
  type,
  filesql;

//User
user = cli.flags.u || cli.flags.user;
if (user == true || user == "true") {
  user = undefined; // Method concat: see configs/route.js
}

//Password
var pass = (cli.flags.p || cli.flags.pass);
if (pass === true) {
  pass = undefined;
} else if (pass) {
  pass = pass.toString();
}

//Database
db = cli.flags.d || cli.flags.database;

//Host
host = cli.flags.h || cli.flags.host || "localhost";
if (host === true) {
  host = undefined;
} else if (host) {
  host = host.toString();
}

//Type gestor database mysql | postgres | mongo
type = cli.flags.t || cli.flags.type || "mysql";
if (type === true || type == "true") {
  type = "mysql";
}

//Schema database postgres
schema = cli.flags.s || cli.flags.schema || "public";
if (schema === true || schema == "true") {
  schema = "public";
}

//Folder models
folder_models = cli.flags.m || cli.flags.models;
if (folder_models === true || folder_models == "true") {
  folder_models = concat(process.cwd(), "models"); // Method concat: see configs/route.js
}

//Folder Controllers
folder_controllers = cli.flags.c || cli.flags.controllers;
if (folder_controllers === true || folder_controllers == "true") {
  folder_controllers = concat(process.cwd(), "controllers"); // Method concat: see configs/route.js
}

//Folder views
folder_views = cli.flags.v || cli.flags.views;
if (folder_views === true || folder_views == "true") {
  folder_views = concat(process.cwd(), "views"); // Method concat: see configs/route.js
}

//file .sql
filesql = cli.flags.f || cli.flags.file;
if (filesql === true || filesql == "true") {
  filesql = undefined; // Method concat: see configs/route.js
}

// Mysql, postgres & mongo connect config.
var config = {
  user: user,
  password: pass,
  host: host,
  database: db,
  schema: schema,
  port: 3306
};

help();
if (filesql) {
  exitsfile(filesql, function (exits) {
    if (exits) {
      generate_my_transpile.generate(filesql, folder_models, folder_controllers, folder_views);
    } else {
      console.log(color("\nERROR: No exits '" + filesql + "'. \nEnter 'sails-inverse-model --help'", "red"));
    }
  });
} else {
  if (db && host) {
    type = type.toLowerCase(); //pg, postgres, mysql
    
    if (type.indexOf("pg") != -1 || type.indexOf("postgres") != -1) { //pg, postgres
      config.port = 5432;
      generate_pg.generate(config, folder_models, folder_controllers, folder_views);
    } else if (type.indexOf("my") != -1 || type.indexOf("mysql") != -1) { //my, mysql
      delete config.schema;
      generate_my.generate(config, folder_models, folder_controllers, folder_views);
    } else if (type.indexOf("mg") != -1 || type.indexOf("mongo") != -1) {
      //mg, mongo
      generate_mg
        .generate(config.host, 27017, config.database, folder_views, folder_models, folder_controllers)
        .then((value) => {
          console.log(color("[OK]", "green") + " Mongo");
        }, (err) => {
          console.log("Error");
          console.error(color(err, "red"));
        });
    }
  } else {
    console.log(color("Missing parameters: enter 'sails-inverse-model --help'", "red"));
  }
}

function help() {
  console.log("User        :", color(user || "Not used", "green"));
  console.log("Password    :", color(pass || "Not used", "green"));
  console.log("Database    :", color(db || "Not used", "green"));
  console.log("Host        :", color(host || "Not used", "green"));
  console.log("Models      :", color((folder_models || "Not generate"), "green"));
  console.log("Views       :", color((folder_views || "Not generate"), "green"));
  console.log("Controllers :", color((folder_controllers || "Not generate"), "green"));
  console.log("DB          :", color((type), "green"));
  console.log("Schema (pg) :", color((schema), "green"));
}