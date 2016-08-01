var compiler_my = require('./compilers/mysql/compiler_mysql');
var compiler_pg = require('./compilers/postgres/compiler_pg');
var compiler_mg = require('./compilers/mongodb/compiler_mongo');

/**
 * [generatepg generate mvc from PostgreSQL]
 * @param  {[var json]} config             [config database PostgreSQL; user, password, host, database, schema, port]
 * @param  {[string]} folder_models      [dir folder models]
 * @param  {[string]} folder_controllers [dir folder controllers]
 * @param  {[string]} folder_views       [dir folder views]
 * @param  {[string]} plurallang         [languaje es|en|fr]
 * @return {[void]}                    [none]
 */
exports.generatepg = function(config, folder_models, folder_controllers, folder_views, plurallang) {
	compiler_pg.generate(config, folder_models, folder_controllers, folder_views, plurallang);
};

/**
 * [generatemy generate mvc from MySQL]
 * @param  {[var json]} config             	[config database MySQL; user, password, host, database, port]
 * @param  {[string]} folder_models      		[dir folder models]
 * @param  {[string]} folder_controllers 		[dir folder controllers]
 * @param  {[string]} folder_views 					[dir folder views]
 * @param  {[string]} plurallang         		[languaje es|en|fr]
 * @return {[void]}                    			[none]
 */
exports.generatemy = function(config, folder_models, folder_controllers, folder_views, plurallang) {
	compiler_my.generate(config, folder_models, folder_controllers, folder_views, plurallang);
};

/**
 * [generatemg description]
 * @param  {[type]} host               [description]
 * @param  {[type]} port               [description]
 * @param  {[type]} database           [description]
 * @param  {[type]} plurallang         [description]
 * @param  {[type]} folder_views       [description]
 * @param  {[type]} folder_models      [description]
 * @param  {[type]} folder_controllers [description]
 * @return {[type]}                    [description]
 */
exports.generatemg = function(host, port, database, plurallang, folder_views, folder_models, folder_controllers) {
	compiler_mm.generate(host, port, database, plurallang, folder_views, folder_models, folder_controllers);
};
