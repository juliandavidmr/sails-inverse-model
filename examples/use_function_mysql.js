var sim = require('../index');

var config = {
  host: "localhost",
  database: "almacen",
  user: "root",
  password: "root",
  port: 3306
};

var folder_controllers = "/your/project/sails/api/"; //if folder_models == "" then: no generate controllers
var folder_models = "/your/project/sails/api/"; //if folder_models == "" then: no generate models
var folder_views = "/your/project/sails/"; //if folder_models == "" then: no generate views

sim.generatemy(config, folder_models, folder_controllers, folder_views);
