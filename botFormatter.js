const CardEntry = require('./cardEntry')
const Config = require('./config.json');

const lineSeparator = '\r\n';

//creates a line for a given length
var lineCharacters = function(length){
  var line = ''

  for (var i = 0; i < length; i++) {
      line += Config.line;
  }

  return line;
}

//adds a certain amount of whitespaces around a given string to properly format it to the total Length
var padContent = function(value, paddedLength){
  var result = ' ' + value;

  var stringLength = paddedLength - 1 - value.length;
  for (var i = 0; i < stringLength; i++) {
      result += ' ';
  }

  return result;
}

//expects a collection of card entries and formats them accordingly
exports.formatCardEntries = function(cardEntries){
  console.log(cardEntries.length);
  var content = '';

  content += Config.left_upper_corner + lineCharacters(57) + Config.right_upper_corner + lineSeparator;

  cardEntries.forEach(function(cardEntry){
    if(cardEntry != null){
      content += Config.left_border + padContent(cardEntry.count, 5) + Config.separator + padContent(cardEntry.name, 30) + Config.separator + padContent(cardEntry.descriptors, 20) + Config.right_border + lineSeparator;

      if(cardEntries.indexOf(cardEntry) < cardEntries.length - 1){
        content += Config.left_border + lineCharacters(57) + Config.right_border + lineSeparator;
      }
    }
  });

  content += Config.left_lower_corner + lineCharacters(57) + Config.right_lower_corner;
  return content;
}

//parses a single line written with bot formatting into a card entry
var parseLineToCardEntry = function(formattedLine){
  formattedLine.replace(Config.left_border, '');
  formattedLine.replace(Config.right_border, '');

  var values = messageLine.split(Config.separator);
  var count = values[0] == null ? '' : values[0].trim();
  var name = values[1] == null ? '' : values[1].trim();
  var descriptors = values[2] == null ? '' : values[2].trim();

  return CardEntry.create(count, name, descriptors);
}

//reads a completely formatted message and returns the contained card entries as a collection
exports.readFormattedCardEntries = function(messageContent){
  var result = [];
  var index = 0;
  var lines = messageContent.split(lineSeparator);
  if(lines != null && lines.length > 1){
    lines.forEach(function(line){
      if(line.includes(Config.separator)){
        result[index++] = parseLineToCardEntry(line);
      }
    });
  }

  return result;
}
