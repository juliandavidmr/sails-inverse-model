const ansi = require('ansi-styles');

// Color text with ansi-styles
color = function(text, color_) {
  color_ = color_.toLowerCase();
  if(color_ == "white") {
    return ansi.white.open + (text) + ansi.white.close;
  } else if (color_ == "red") {
    return ansi.red.open + (text) + ansi.red.close;
  } else if (color_ == "green") {
    return ansi.green.open + (text) + ansi.green.close;
  } else if (color_ == "yellow") {
    return ansi.yellow.open + (text) + ansi.yellow.close;
  } else if (color_ == "blue") {
    return ansi.blue.open + (text) + ansi.blue.close;
  }
};
