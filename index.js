'use strict';

var compiler_my = require('./compilers/compiler_mysql');
var compiler_pg = require('./compilers/compiler_pg');

/**
 * [generatepg generate mvc from PostgreSQL]
 * @param  {[type]} config             [config database PostgreSQL; user, password, host, database, schema, port]
 * @param  {[type]} folder_models      [dir folder models]
 * @param  {[type]} folder_controllers [dir folder controllers]
 * @param  {[type]} folder_views       [dir folder views]
 * @param  {[type]} plurallang         [languaje es|en|fr]
 * @return {[type]}                    [none]
 */
exports.generatepg = function (config, folder_models, folder_controllers, folder_views, plurallang) {
  compiler_pg.generate(config, folder_models, folder_controllers, folder_views, plurallang);
};

/**
 * [generatemy generate mvc from MySQL]
 * @param  {[type]} config             [config database MySQL; user, password, host, database, port]
 * @param  {[type]} folder_models      [dir folder models]
 * @param  {[type]} folder_controllers [dir folder controllers]
 * @param  {[type]} plurallang         [languaje es|en|fr]
 * @return {[type]}                    [none]
 */
exports.generatemy = function (config, folder_models, folder_controllers, plurallang) {
  compiler_pg.generate(config, folder_models, folder_controllers, folder_views, plurallang);
};
