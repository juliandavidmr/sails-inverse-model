'use strict';

var compiler_my = require('./compilers/compiler_mysql');
var compiler_pg = require('./compilers/compiler_pg');

/**
 * [generatepg generate mvc from PostgreSQL]
 * @param  {[var json]} config             [config database PostgreSQL; user, password, host, database, schema, port]
 * @param  {[string]} folder_models      [dir folder models]
 * @param  {[string]} folder_controllers [dir folder controllers]
 * @param  {[string]} folder_views       [dir folder views]
 * @param  {[string]} plurallang         [languaje es|en|fr]
 * @return {[void]}                    [none]
 */
exports.generatepg = function (config, folder_models, folder_controllers, folder_views, plurallang) {
  compiler_pg.generate(config, folder_models, folder_controllers, folder_views, plurallang);
};

/**
 * [generatemy generate mvc from MySQL]
 * @param  {[var json]} config             [config database MySQL; user, password, host, database, port]
 * @param  {[string]} folder_models      [dir folder models]
 * @param  {[string]} folder_controllers [dir folder controllers]
 * @param  {[string]} plurallang         [languaje es|en|fr]
 * @return {[void]}                    [none]
 */
exports.generatemy = function (config, folder_models, folder_controllers, plurallang) {
  compiler_pg.generate(config, folder_models, folder_controllers, folder_views, plurallang);
};
