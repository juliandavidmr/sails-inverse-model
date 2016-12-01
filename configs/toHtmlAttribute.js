exports.SailstoHtmlAtt = function (type_data) {
  switch (type_data) {
    case 'text':
    case 'string':
    case 'mediumtext':
    case 'longtext':
    case 'array':
    case 'json':
      return 'text';
    case 'float':
    case 'integer':
    case 'objectid':
      return 'number';
    case 'boolean':
    case 'binary':
      return 'checkbox';
    default:
      return type_data;
  }
}