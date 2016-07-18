var gencode = require('gencode');
var data = require('./data.json');

var clean = [];
var tablas = [];


/*exports.escanear = function(ruta) {
	var atributos = [];
	for (var i = 0; i < 10; i++) {
		atributos.push({
				Type: "int(11)",
				Null: "NO",
				Key: "PRI",
				Default: null,
				Extra: "auto_increment"
		})
	}
	tablas.push({
		table_name: "table",
		atr: atributos
	})
	console.log(JSON.stringify(tablas, null, 4));
}

exports.escanear('jjjj');*/


gencode.utils.toArray('../test/new.sql', 'utf8', '\n').then((value) => { //Too: \n, \t, -, etc.
	var allData = "";
	var tables = [],
		dataValid = [];
	value.map((item) => {
		item = item.toString().trim().toLowerCase();

		if (!isComment(item)) {
			allData += item;
		}
	});
	var splits = allData.split(";");
	for (var i = 0; i < splits.length; i++) {
		if (isValid(splits[i])) {
			dataValid.push(splits[i]);
		}
	}

	for (var i = 0; i < dataValid.length; i++) {
		if (dataValid[i].toString().toLowerCase().trim().startsWith('create table')) {
			tables.push(verifyContains(dataValid[i].toString()));
		}
	}
	getTablesJSON(tables);

}, (error) => {
	console.log("ERROR=>", error);
});

function verifyContains(item) {
	var result = "";
	var state = true;
	var start, end = 0;
	var add;
	for (var i = 0; i < data.contains.length; i++) {
		result = "";
		state = true;
		while (state) {
			start = item.indexOf(data.contains[i]);
			if (start != -1) {
				end = item.substring(start, item.length).indexOf(")") + start;
				result += item.substring(0, start);
				add = item.substring(start, end);
				while (add.indexOf(",") != -1) {
					add = add.replace(",", "-");
				}
				result += add;
				item = item.substring(end, item.length);
			} else {
				state = false;
			}
		}
		result += item;
		item = result;
	}
	return result;
}

function cleanItem(item) {
	var line = item;
	for (var i = 0; i < data.start.length; i++) {
		if (item.startsWith(data.start[i])) {
			line = item.substring(data.start[i].length + 1, item.length);
			break;
		}
	}
	return line;
}

function getTableName(item) {
	var firstLine = item.indexOf('(');
	var name = item.substring(0, firstLine).trim().replace('`', '').replace('`', '');
	return name;
}

function isAtribute(line) {
	for (var j = 0; j < data.attr.length; j++) {
		if (line.toString().trim().startsWith(data.attr[j])) {
			return false;
		}
	}
	return true;
}

function getAtributes(item) {
	var attrLines = item.indexOf('(');
	item = item.substring(attrLines + 1, item.length);
	var atributes = [];
	var lines = item.split(',');
	var split;
	for (var i = 0; i < lines.length; i++) {
		lines[i] = lines[i].replace("not null", "not_null");
		if (isAtribute(lines[i])) {

			split = lines[i] != "" ? lines[i].split(" ") : "";
			atributes.push({
				Name: getValue(0, split),
				Type: getValue(1, split),
				Size: getValue(2, split),
				NotNull: split.length > 2,
				AI: split.length > 3,
			})
		}
	}
	return atributes;
}

function getValue(pos, values) {
	var result = "";

	switch (pos) {
		case 0:
			result = values[pos].replace('`', '').replace('`', '');
			break;
		case 1:
			var val = values[pos];
			if (!val.startsWith("enum")) {
				var start = val.indexOf("(");
				result = start == -1 ? val : val.substring(0, start);
			} else {
				result = val;
			}
			break;
		case 2:
			var val = values[1];
			if (!val.startsWith("enum")) {
				var start = val.indexOf("(");
				result = start == -1 ? "" : val.substring(start + 1, val.indexOf(")"));
			} else {
				result = "";
			}
			break;
		default:
	}
	return result;
}

function getTablesJSON(tables) {
	var tablesJSON = [];
	var item, line;
	for (var i = 0; i < tables.length; i++) {
		item = tables[i].toString().toLowerCase();
		tables[i] = cleanItem(item);

		tablesJSON.push({
			table_name: getTableName(tables[i]),
			atr: getAtributes(tables[i])
		})
	}
	/*var atributos = [];*/
	console.log("Yilver");
	console.log("d: " + tablesJSON.length);
	console.log(JSON.stringify(tablesJSON, null, 4));
}

function isComment(line) {
	return line.trim().startsWith('--');
}

function isValid(line) {
	if (line != "") {
		for (var i = 0; i < data.ignore.length; i++) {
			if (line.startsWith(data.ignore[i])) {
				return false;
			}
		}
	} else {
		return false;
	}
	return true;
}
