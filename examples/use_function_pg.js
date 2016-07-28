var sim = require('../index');

var config = {
  host: "localhost",
  database: "example",
  user: "postgres",
  pass: "root",
  port: 5432,
  schema: "public"
};

var folder_controllers = "/your/project/sails/api/"; //if folder_models == "" then: no generate controllers
var folder_models = "/your/project/sails/api/"; //if folder_models == "" then: no generate models
var folder_views = "/your/project/sails/"; //if folder_models == "" then: no generate views
var plurallang = "es"; //en|es|fr

sim.generatepg(config, folder_models, folder_controllers, folder_views, plurallang);
