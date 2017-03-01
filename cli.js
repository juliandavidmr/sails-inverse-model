#!/usr/bin/env node

'use strict';

var meow = require('meow');
var ansi = require('ansi-styles');
var assert = require('assert');

require('./configs/color');
require('./configs/route');
require('./generator/save');

var convert = require('./configs/toHtmlAttribute');

var generate_my_transpile = require('./generator/mysql/compiler_sqlfile_mysql');
var generate_my = require('./generator/mysql/compiler_mysql');
var generate_pg = require('./generator/postgres/compiler_pg');
var generate_mg = require('./generator/mongodb/compiler_mongo');
var generate_view = require('./genviews/view');

var exitsfile = require('is-existing-file');
var message = require('./configs/message');
var constants = require('./configs/constants');

var cli = meow(message.show);

var g = cli.flags.g || cli.flags.generate;

if (g) {
  /**
	 * Generator manual
	 * Input standar
	 */
  var name = cli.flags.n || cli.flags.name; // Name model, controller and view

  var Model = [];           // ArrayList of models
  var option = (g === true) // Option default
    ? 'all'                 // Option Controller, Views & Models
    : g;                    // Select by user

  var attributes = cli.flags.attributes || cli.flags.a; // Attributes

  var split_attr = attributes.split(' ');
  // console.log("attributes: ", JSON.stringify(split_attr, null, 3));

  let aux_item_model = []; // Item Model
  let aux_item_view = [];  // Item View

  // Example: [xyz:string, abc:number]
  split_attr.map((item) => {
    let separate = item.split(':');

    paramSearchFill(separate, function (result) {
      // console.log('=>',result);

      var _aux_item = separate[0] + ": { type: '" + separate[1] + "', ";
      aux_item_model.push(_aux_item + result + "}");

      var content_view = {
        required: result.indexOf(constants.REQUIRED) !== -1, // Index string required for view input <input type="any" required="true | false">
        default_value: 0,
        name: separate[0],
        type: convert.SailstoHtmlAtt(separate[1])
      };

      aux_item_view.push(JSON.stringify(content_view));
    });
  });

  Model.push({
    model_name: name || 'Name'.concat(parseInt(Math.random(20) * 100)), // Name file model, controller, and folder view
    content: "attributes: { " + aux_item_model + " }",
    view_content: aux_item_view
  });

  // console.log('Attri: => ', JSON.stringify(Model, null, 4));

  switch (option) {
    case 'view':
      generate_view.generate(Model, concat(process.cwd(), 'Views'));
      break;
    case 'model':
      saveModels(concat(process.cwd(), 'Models'), Model);
      break;
    case 'controller':
      saveControllers(concat(process.cwd(), 'Controllers'), Model);
      break;
    case 'all':
      saveModels(concat(process.cwd(), 'Models'), Model);
      saveControllers(concat(process.cwd(), 'Controllers'), Model);
      generate_view.generate(Model, concat(process.cwd(), 'Views'));
      break;
  }
} else {
  /**
	 * Generator automatic
	 * Databases
	 */
  var user,               // Option user database
    pass,                 // Option password database
    db,                   // Option name database
    host,                 // Option host database
    port,                 // Option port database
    folder_models,        // Option path folder models 
    folder_controllers,   // Option path folder controllers
    folder_views,         // Option path folder views
    schema,               // Option schema database => postgres
    type,                 // Option type gestor database: mysql, postgres, mongodb
    filesql;              // Option path file .sql

  //User
  user = cli.flags.u || cli.flags.user;
  if (user == true || user == "true") {
    user = undefined; // Method concat: see configs/route.js
  }

  //Password
  var pass = (cli.flags.p || cli.flags.pass);
  if (pass === true) {
    pass = undefined;
    console.warn("Missing password database");
    process.exit(1);    
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
  type = cli.flags.t || cli.flags.type || "mysql"; // Default Mysql
  console.log(">>", type);
  if (type === true || type == "true") {
    type = "mysql";
  }

  //Schema database postgres
  schema = cli.flags.s || cli.flags.schema || "public"; // Default public
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

  info(); // Show message info
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
}

/**
 * Menu info console
 */
function info() {
  console.log("User       :", color(user || "Not used", "green"));
  console.log("Password   :", color(pass || "Not used", "green"));
  console.log("Database   :", color(db || "Not used", "green"));
  console.log("Host       :", color(host || "Not used", "green"));
  console.log("Models     :", color((folder_models || "Not generate"), "green"));
  console.log("Views      :", color((folder_views || "Not generate"), "green"));
  console.log("Controllers:", color((folder_controllers || "Not generate"), "green"));
  console.log("DB         :", color((type), "green"));
  console.log("Schema (pg):", color((schema), "green"));
}

/**
 * Search params
 *
 * @param {array} params
 * @param {function} cb
 * @returns string
 */
function paramSearchFill(params, cb) {
  var output = '';

  for (var i = 2; i < params.length; i++) {
    var element = params[i];

    if (element == 'r' || element == 'required') {
      output += constants.REQUIRED;
    } else if (element == 'u' || element == 'unique') {
      output += constants.UNIQUE;
    } else if (element == 'a' || element == 'autoincrement') {
      output += constants.AUTOINC;
    } else if (element == 'k' || element == 'primarykey') {
      output += constants.PRIMARYKEY;
    }
  }

  if (output.endsWith(',')) {
    output = output.substring(0, output.length - 1);
  }

  return cb(output);
}
