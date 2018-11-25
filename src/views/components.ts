import { concat } from 'src/configs/route';

var fs = require('fs');

// content create.hbs
export function create(cb) {
  return read("/crud/create.hbs", function (content) {
    cb(content);
  });
};

// content index.hbs
export function index(cb) {
  return read("/crud/index.hbs", function (content) {
    cb(content);
  });
};

// content update.hbs
export function edit(cb) {
  return read("/crud/edit.hbs", function (content) {
    cb(content);
  });
};

// content show.hbs
export function show(cb) {
  return read("/crud/show.hbs", function (content) {
    cb(content);
  });
};

//Read file hbs and return code
function read(name, cb) {
  fs.readFile(concat(__dirname, name), 'utf8', (err, data) => {
    if (err) throw err;
    cb(data.toString());
  });
}