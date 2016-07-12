/**
 * Plural.js
 * @autor Julian David (@anlijudavid)
 * @version 1.0.0
 * 2016
 */

var plural_en = require('pluralize');
var plural_es = require('pluralize-es');
var plural_fr = require('pluralize-fr');

exports.pluraliza = function(word, lang) {
	if (lang) {
		lang = lang.toLowerCase();
		if (lang == "en") {
			return plural_en(word);
		} else if (lang == "es") {
      return plural_es(word);
		} else if (lang == "fr") {
      return plural_fr(word);
		} else {
      return word;
    }
	} else {
		return word;
	}
};

/*

pluralize('test') //=> "tests"
pluralize('test', 1) //=> "test"
pluralize('test', 5) //=> "tests"
pluralize('test', 1, true) //=> "1 test"
pluralize('test', 5, true) //=> "5 tests"

pluralize.plural('regex') //=> "regexes"
pluralize.addPluralRule(/gex$/i, 'gexii')
pluralize.plural('regex') //=> "regexii"

pluralize.plural('singles', 1) //=> "single"
pluralize.addSingularRule(/singles$/i, 'singular')
pluralize.plural('singles', 1) //=> "singular"

pluralize.plural('irregular') //=> "irregulars"
pluralize.addIrregularRule('irregular', 'regular')
pluralize.plural('irregular') //=> "regular"

pluralize.plural('paper') //=> "papers"
pluralize.addUncountableRule('paper')
pluralize.plural('paper') //=> "paper"
*/
