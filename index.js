'use strict';


var yes = require('./yes.json');
var no = require('./no.json');
var all = yes.concat(no).sort();

exports.yes = yes;
exports.no = no;
exports.all = all;
exports.yesRandom = (yes);
exports.noRandom = (no);
exports.allRandom = (all);
exports.nee = ['2', '3', '4'];
