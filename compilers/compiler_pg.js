var PostgresSchema = require('pg-json-schema-export');

exports.generate = function(config, folder_models, folder_controllers, plurallang) {

	var connection = {
		user: 'postgres',
		password: '123',
		host: 'localhost',
		port: 5432,
		database: 'thedb'
	}

	PostgresSchema.toJSON(connection, 'public')
		.then(function(schemas) {
			// handle json object
			console.log(JSON.stringify(chemas));
		})
		.catch(function(error) {
			// handle error
		});
};
