var compiler_my = require('./generator/mysql/compiler_mysql');
var compiler_pg = require('./generator/postgres/compiler_pg');
var compiler_mg = require('./generator/mongodb/compiler_mongo');

/**
 * [generatepg generate mvc from PostgreSQL]
 * @param  {json}   config              [config database PostgreSQL; user, password, host, database, schema, port]
 * @param  {string} folder_models       [dir folder models]
 * @param  {string} folder_controllers  [dir folder controllers]
 * @param  {string} folder_views        [dir folder views]
 * @return {void}                       [none]
 */
exports.generatepg = function (config, folder_models, folder_controllers, folder_views) {
	compiler_pg.generate(config, folder_models, folder_controllers, folder_views);
};

/**
 * [generatemy generate mvc from MySQL]
 * @param  {[json]} config             	[config database MySQL; user, password, host, database, port]
 * @param  {string} folder_models      		[dir folder models]
 * @param  {string} folder_controllers 		[dir folder controllers]
 * @param  {string} folder_views 					[dir folder views]
 * @return {[void]}                    			[none]
 */
exports.generatemy = function (config, folder_models, folder_controllers, folder_views) {
	compiler_my.generate(config, folder_models, folder_controllers, folder_views);
};

/**
 * [generatemg MongoDB]
 * @param  {string} host               [description]
 * @param  {[number]} port               [description]
 * @param  {string} database           [description]
 * @param  {string} folder_views       [description]
 * @param  {string} folder_models      [description]
 * @param  {string} folder_controllers [description]
 * @return {[none]}                    [description]
 */
exports.generatemg = function (host, port, database, folder_views, folder_models, folder_controllers) {
	compiler_mg.generate(host, port, database, folder_views, folder_models, folder_controllers);
};
