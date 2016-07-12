/**
 * scanner.js
 * @autor Julian David (@anlijudavid)
 * @version 1.0.0
 * 2016
 */

var gencode = require('gencode');
var data = require('./data.json');

var clean = [];

gencode.utils.toArray('../test/inputsql.sql', 'utf8', '\n').then((value) => { //Too: \n, \t, -, etc.
	value.map((item) => {
		item = item.toString().trim().toLowerCase();
		if (sirve(item)) {
			clean.push(item);
		}
	});

  clean = reclean(clean);
	clean = arrayToString(clean);
	clean = clean.split(";");

  for (var i = 0; i < clean.length; i++) {
		if (clean[i].startsWith("create table")) {
			console.log("-------------------------------------------------------------");
			//console.log(clean[i]); //Content of table describe :D
			console.log(getTable(clean[i]));
		}
  }

	//console.log("Result:", JSON.stringify(value));
}, (error) => {
	console.log("ERROR=>", error);
});

function sirve(line) {
  for (var i = 0; i < data.ignore.length; i++) {
    if (line.startsWith(data.ignore[i])) {
      //console.log("--->"+line + " empieza con " + i);
      return false;
    }
  }
  return true;
}


/**
 * [getTable get prop table from sql]
 * @param  {[type]} describe [description]
 * @return {[type]}          [description]
 */
function getTable(describe) {
	var attr = "/*Algo para filtrar*/";
	console.log(">>");
	console.log(attr);
	console.log("<<");
	return describe;
}

/**
 * [reclean quit spaces]
 * @param  {[type]} clean [array]
 * @return {[array]}       [array cleaned]
 */
function reclean(clean) {
  var out = [];
  clean.map((item) => {
    if (item.trim().length != 0) {
      out.push(item);
    }
  });
  return out;
}

/**
 * [arrayToString convert array to lines of string]
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
function arrayToString(array) {
	var outstring = "";
	array.map((item) => {
		outstring = outstring.concat(item)
	});
	return outstring;
}
