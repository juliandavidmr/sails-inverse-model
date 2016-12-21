var fs = require('fs');
require('../configs/route');

// content create.hbs
exports.create = function (cb) {
  return read("/crud/create.hbs", function (content) {
    cb(content);
  });
};

// content index.hbs
exports.index = function (cb) {
  return read("/crud/index.hbs", function (content) {
    cb(content);
  });
};

// content update.hbs
exports.edit = function (cb) {
  return read("/crud/edit.hbs", function (content) {
    cb(content);
  });
};

// content show.hbs
exports.show = function (cb) {
  return read("/crud/show.hbs", function (content) {
    cb(content);
  });
};

//Read file hbs and return code
function read(name, cb) {
  fs.readFile(concat(__dirname, name), 'utf8', (err, data) => {
    if (err) 
      throw err;
    cb(data.toString());
  });
}