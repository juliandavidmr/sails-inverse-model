// Concat text
concat = function (text1, text2) {
  if (process.platform === 'win32') {
    return text1.concat("\\").concat(text2);
  } else {
    return text1.concat("/").concat(text2);
  }
};