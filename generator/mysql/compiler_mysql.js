/**
 * compiler_mysql.js
 * 2016
 *
 * Process mysql to models waterline
 */
var mysqldesc = require('mysqldesc');
var s = require("underscore.string");

var to = require('../../configs/to');
var view = require('../../genviews/view');
var async = require("async");

require('../save');
require('../../configs/color');

const FK_IDENTIFIER = "id";

exports.generate = function(config, folder_models, folder_controllers, folder_views) {
  // Describe connected database
  mysqldesc(config, function(err, data) {
    if (err) {
      console.log("ERROR: ", err);
    } else {
      var Models = [],
        count = 1;

      async.forEachOf(data, function(value, table, callback) {
        if (data.hasOwnProperty(table)) {
          console.log(color("[" + (count++) + " Generating]", "blue") + " " + table + " table ...");
          var tableCloumnsData = data[table].columns ? data[table].columns : data[table];
          var attributes_sails = [],
            view_contents = [];
          mysqldesc.keyColumnUsage(config, config.database, table, function(err, data2) {
            for (var colum in tableCloumnsData) {
              //console.log(table + "=>" + colum);
              var reference_fk = undefined;
              if (data2[colum] && data2[colum]["REFERENCED_TABLE_NAME"]) {
                reference_fk = {
                  table: data2[colum].REFERENCED_TABLE_NAME,
                  column: data2[colum].REFERENCED_COLUMN_NAME
                };
                //console.log(table + "=>" + JSON.stringify(data2[colum], null, 4));
              }
              var attributes = tableCloumnsData[colum];
              //console.log(attributes);
              var result = transpile(attributes, colum, reference_fk);
              view_contents.push(result.view_content);
              attributes_sails.push(result.model_content);
            }
            //console.log("-------------");
            Models.push({
              model_name: s.camelize(table).trim(),
              content: "attributes: { " + attributes_sails + " }",
              view_content: view_contents
            });
            //console.log(table + " = " + JSON.stringify(table, null, 4));
            callback(null, table);
          });
        }
      }, function(err) {
        console.log([Models.length, "tables"].join(" "));

        //console.log(Models);
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
    }
  });
};

/**
 * [transpile: convert all attributes mysql to orm sailsjs]
 * @param  {[type]} attributes     	[description]
 * @param  {[type]} name_attribute 	[description]
 * @param  {[type]} reference_fk 	  [description]
 * @return {[type]}                	[description]
 */
function transpile(attributes, name_attribute, reference_fk) {
  //console.log("attributes " + JSON.stringify(attributes, null, 4));
  var type_ = attributes["Type"];
  var default_value_ = attributes["Default"];
  var is_nullable_ = attributes["Null"];
  var key_ = attributes["Key"];

  //console.log(JSON.stringify(attributes));
  return exports.toSailsAttribute(type_, name_attribute, default_value_, is_nullable_, key_, reference_fk);
}

exports.toSailsAttribute = function(Type, attrib, default_value_, is_nullable_, key_, reference_fk) {
  var content_view = {
    required: false,
    default_value: default_value_,
    name: attrib,
    type: undefined
  };

  var attribute = [];

  var type = Type.toLowerCase();
  var typeSplit = type.match(/(enum)\((.+)\)/);
  if(!typeSplit) var typeSplit = type.match(/(\w+)\((\d+),(\d+)\)/);
  if(!typeSplit) var typeSplit = type.match(/(\w+)\((\d+)\)/);
  if(!typeSplit) var typeSplit = type.match(/(\w+)/);

  if(typeSplit[1] === 'enum') {
    attribute.push(getEnum(typeSplit[2]));
    content_view.type = "text";
  } else if(typeSplit[1] === 'json') {
    attribute.push(getJson(typeSplit[2]));
    content_view.type = "text";
  } else if(['varchar', 'char', 'tinytext', 'text', 'mediumtext', 'longtext', 'time'].indexOf(typeSplit[1]) > -1) {
    attribute.push(getString(typeSplit[1], typeSplit[2]));
    content_view.type = "text";
  } else if(['int', 'smallint', 'tinyint', 'bigint'].indexOf(typeSplit[1]) > -1) {
    attribute.push(getInteger(typeSplit[1], typeSplit[2]));
    content_view.type = "number";
  } else if(['decimal', 'double', 'real', 'float'].indexOf(typeSplit[1]) > -1) {
    attribute.push(getNumber(typeSplit[1], typeSplit[2]));
    content_view.type = "number";
  } else if(['bool', 'bit'].indexOf(typeSplit[1]) > -1) {
    attribute.push(getBoolean(typeSplit[1]));
    content_view.type = "checkbox";
  } else if(typeSplit[1] === 'year') {
    attribute.push(getInteger(typeSplit[1], typeSplit[2]));
    content_view.type = "number";
  } else if(typeSplit[1] === 'date') {
    attribute.push(getString(typeSplit[1]));
    content_view.type = "text";
  } else if(typeSplit[1] === 'datetime', 'timestamp') {
    attribute.push(getString(typeSplit[1]));
    content_view.type = "text";
  }

  if (key_ === "PRI") {
    // attribute.push(getPK());
    content_view.required = true;
  } else if (key_ === "MUL") {
    if (reference_fk) {
      attrib = attrib.replace(FK_IDENTIFIER, "");
      //attrib = reference_fk.table;
      //attribute.push('model: ' + reference_fk.table);
      attribute = [`model: "${s.camelize(reference_fk.table).trim()}"`];
    }
  } else if (key_ === "UNI") {
    attribute.push(getUnique());
  }
  if (default_value_ !== "" && default_value_ !== null) {
    var def = "defaultsTo: ";
    if (content_view.type == "text") {
      def += `"${default_value_}"`;
    } else {
      def += default_value_;
    }
    attribute.push(def);
  }
  else if (is_nullable_ === "NO") {
    attribute.push(getRequired());
    content_view.required = true;
  }

  var result = {
    model_content: attrib + ": {" + attribute.join(',') + "}",
    view_content: JSON.stringify(content_view)
  };
  return result;
};

function getRequired() {
  return "required: true";
}

function getUnique() {
  return "unique: true";
}

function getString(type, length) {
  var out = [];
  out.push('type: "string"');
  out.push(`columnType: "${type}"`);
  if (length) {
    out.push(`maxLength: ${length}`);
  }
  return quitComma(out.join(","));
}

function getInteger(type, length) {
  var out = [];
  out.push('type: "number"');
  out.push(`columnType: "${type}"`);
  out.push(`isInteger: true`);
  // if (length) {
  //   out.push(`maxLength: ${length}`);
  // }
  return quitComma(out.join(","));
}

function getNumber(type, length) {
  var out = [];
  out.push('type: "number"');
  out.push(`columnType: "${type}"`);
  // if (length) {
  //   out.push(`maxLength: ${length}`);
  // }
  return quitComma(out.join(","));
}

function getBoolean(type) {
  var out = [];
  out.push('type: "boolean"');
  out.push(`columnType: "${type}"`);
  return quitComma(out.join(","));
}

// TODO: Mejorar la detección de items con una expresion regular
function getEnum(enums) {
  var outEnums = [];
  var line = enums.split(/['|"](.*?)['|"],*/);
  line.map((item) => {
    if (item !== "") {
      outEnums.push(`"${item}"`);
    }
  });
  var out = [];
  out.push('type: "string"');
  out.push('columnType: "enum"');
  out.push(`isIn: [${quitComma(outEnums.join(","))}]`);
  return quitComma(out.join(","));
}

function getJson(length) {
  var out = [];
  out.push('type: "json"');
  if (length) {
    out.push(`maxLength: ${length}`);
  }
  return quitComma(out.join(","));
}

function quitComma(str) {
  if (str.trim().endsWith(",")) {
    return str.trim().substr(0, str.length - 1);
  }
  return str;
}

exports.quitComma = quitComma;
