'use strict';

exports.toSailsAttribute = function(prop, attrib) {
	var attribute = attrib.toLowerCase() + ": {";
	var size, type, required, primarykey, unique, autoincrement, vdefault;
	//console.log(attrib);
	if (prop.Type.toLowerCase().indexOf('varchar') > -1) {
		attribute = attribute.concat(getString(prop.Type));
	} else if (prop.Type.toLowerCase().indexOf('int') > -1
    || prop.Type.toLowerCase().indexOf('small') > -1) { //Include smallint
		attribute = attribute.concat(getInteger(prop.Type));
	} else if (prop.Type.toLowerCase().indexOf('bool') > -1
    || prop.Type.toLowerCase().indexOf('bit') > -1) {
		attribute = attribute.concat(getBoolean());
	} else if (prop.Type.toLowerCase().indexOf('float') > -1 ||
		prop.Type.toLowerCase().indexOf('dec') > -1 //Include decimal
		|| prop.Type.toLowerCase().indexOf('numeric') > -1
    || prop.Type.toLowerCase().indexOf('real') > -1
    || prop.Type.toLowerCase().indexOf('precicion') > -1) {
		attribute = attribute.concat(getFloat());
	} else if (prop.Type.toLowerCase().indexOf('enum') > -1) {
		attribute = attribute.concat(getEnum(prop.Type));
	} else if (prop.Type.toLowerCase().indexOf('text') > -1) {
		attribute = attribute.concat(getText());
	} else if (prop.Type.toLowerCase().indexOf('datetime') > -1) {
		attribute = attribute.concat(getDateTime());
	} else if (prop.Type.toLowerCase().indexOf('date') > -1
    || prop.Type.toLowerCase().indexOf('year') > -1) {
		attribute = attribute.concat(getDate());
	} else if (prop.Type.toLowerCase().indexOf('datetime') > -1) {
		attribute = attribute.concat(getDateTime());
	}

	attribute = attribute.concat(", " + getOthers(prop));

	attribute = attribute.concat("}");
	//console.log(attribute);
	return attribute;
};

function getString(Type) {
	var out = [];
	var attr_aux = Type.toLowerCase().split(/[(*)]/);
	out.push('type: "string"');
	if (attr_aux[1]) {
		out.push("size: " + parseInt(attr_aux[1]));
	}
	return quitComma(out.join(","));
}

function getInteger(Type) {
	var out = [];
	var attr_aux = Type.toLowerCase().split(/[(*)]/);
	out.push('type: "integer"');
	if (attr_aux[1]) {
		out.push("size: " + parseInt(attr_aux[1]));
	}
	return quitComma(out.join(","));
}

function getFloat() {
	return 'type: "float"';
}

function getBoolean() {
	return 'type: "binary"';
}

function getText() {
	return 'type: "text"';
}

function getDate() {
	return 'type: "date"';
}

function getDateTime() {
	return 'type: "datetime"';
}

function getEnum(Type) {
	var out = [];
	var pa1 = Type.indexOf('(');
	var pa2 = Type.indexOf(')');

	pa1++;
	var line = Type.substring(pa1, pa2).replace(",", "").split('\'');
	//console.log(pa1 + ", " + pa2);
	line.map((item) => {
		if (item != "") {
			out.push('"' + item + '"');
		}
	});
	//out.push("required: true");
	return "enum: [" + quitComma(out.join(",")) + "]";
}

function getOthers(prop) {
	var out = [];

	if (prop["Key"]) {
		if (prop["Key"].toLowerCase().indexOf("pri") > -1) {
			out.push("primaryKey: true");
      out.push("unique: true");
		}
	}
  if (prop["Null"].toLowerCase().indexOf("no") > -1 || prop["Key"]) {
    out.push("required: true");
  }
  if (prop["Extra"].toLowerCase().indexOf("increment") > -1) {
		out.push("autoIncrement: true");
	}
	return out.join(", ");
}


function quitComma(str) {
	if (str.trim().endsWith(",")) {
		return str.trim().substr(0, str.length - 1);
	}
	return str;
}

exports.quitComma = quitComma;
