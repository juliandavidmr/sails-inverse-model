var sim = require('../index');

var folder_controllers = "/your/project/sails/api/"; //if folder_models == "" then: no generate controllers
var folder_models = "/your/project/sails/api/"; //if folder_models == "" then: no generate models
var folder_views = "/your/project/sails/"; //if folder_models == "" then: no generate views

//                host      port         database         views            models          controllers
sim.generatemg('localhost', 27017, 'my_name_collection', folder_views, folder_models, folder_controllers);
