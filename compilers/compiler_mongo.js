/**
 * compiler_mongo.js
 * @autor Julian David (@anlijudavid)
 * 2016
 *
 * Process mysql to models waterline
 */

 var mondongo = require('mondongo');

 // Connection URL
 var url = 'mongodb://localhost:27017/blog_db';

 mondongo.describe(url).then((described) => {
   console.log("Output:\n", JSON.stringify(described, null, 4));
 });
