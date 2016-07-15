concat = function(text1, text2) {
  if (require('is-os').isWindows()) {
    return text1 + "\\" + text2;
  } else {
    return text1 + "/" + text2;
  }
}
