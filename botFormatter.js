const CardEntry = require('./cardEntry')
const Config = require('./config.json')

const lineSeparator = '\r\n';
const countLength = 10;
const nameLength = 40;
const descLength = 30;

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

  var valueLength = typeof value == "string" ? value. length : value.toString().length ;

  var stringLength = paddedLength - 1 - valueLength;
  for (var i = 0; i < stringLength; i++) {
      result += ' ';
  }

  return result;
}

//expects a collection of card entries and formats them accordingly
exports.formatCardEntries = function(author, cardEntries){
  var content = '```Wants of ' + author.username + lineSeparator + lineSeparator;

  content += Config.left_upper_corner + lineCharacters(countLength) + Config.upper_intersection + lineCharacters(nameLength) + Config.upper_intersection + lineCharacters(descLength) + Config.right_upper_corner + lineSeparator;
  content += Config.left_border + padContent('Count', countLength) + Config.full_intersection + padContent('Card Name', nameLength) + Config.full_intersection + padContent('Card Descriptors', descLength) + Config.right_border + lineSeparator;

  cardEntries.forEach(function(cardEntry){
    if(cardEntry != null){
      content += Config.left_border + lineCharacters(countLength) + Config.full_intersection + lineCharacters(nameLength) + Config.full_intersection + lineCharacters(descLength) + Config.right_border + lineSeparator;
      content += Config.separator + padContent(cardEntry.count, countLength) + Config.separator + padContent(cardEntry.name, nameLength) + Config.separator + padContent(cardEntry.descriptors, descLength) + Config.separator + lineSeparator;
    }
  });

  content += Config.left_lower_corner + lineCharacters(countLength) + Config.lower_intersection + lineCharacters(nameLength) + Config.lower_intersection + lineCharacters(descLength) + Config.right_lower_corner + '```';
  return content;
}

//parses a single line written with bot formatting into a card entry
var parseLineToCardEntry = function(formattedLine){
  formattedLine = formattedLine.substring(1, formattedLine.length - 1)

  var values = formattedLine.split(Config.separator);
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
