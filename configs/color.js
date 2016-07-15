var ansi = require('ansi-styles');

color = function(text, color) {
  var color = color.toLowerCase();
  if(color == "white") {
    return ansi.white.open + (text) + ansi.white.close;
  } else if (color == "red") {
    return ansi.red.open + (text) + ansi.red.close;
  } else if (color == "green") {
    return ansi.green.open + (text) + ansi.green.close;
  } else if (color == "yellow") {
    return ansi.yellow.open + (text) + ansi.yellow.close;
  } else if (color == "blue") {
    return ansi.blue.open + (text) + ansi.blue.close;
  }
}
