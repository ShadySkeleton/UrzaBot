const CardEntry = require('./cardEntry')
const UserInputParser = require('./userInputParser')
const Config = require('./config.json')

const lineSeparator = '\r\n';
const countLength = 5;
const nameLength = 35;
const editionLength = 5;
const descLength = 20;

//adds a certain amount of whitespaces around a given string to properly format it to the total Length
var padContent = function(value, paddedLength){
  var result = ' ' + value;

  var valueLength = typeof value == "string" ? value.length : value.toString().length ;


  var stringLength = paddedLength - valueLength - 1;
  for (var i = 0; i < stringLength; i++) {
      result += ' ';
  }

  return result;
}

//expects a collection of card entries and formats them accordingly
exports.formatCardEntries = function(username, cardEntries){
  var content = '```Wants of ' + username + lineSeparator + lineSeparator;

  cardEntries.forEach(function(cardEntry){
    if(cardEntry != null){
      content += padContent(cardEntry.count, countLength) + Config.separator + padContent(cardEntry.edition, editionLength) + Config.separator + padContent(cardEntry.name, nameLength) + Config.separator + padContent(cardEntry.descriptors, descLength)  + lineSeparator;
    }
  });

  content += '```'

  return content;
}

//reads a completely formatted message and returns the contained card entries as a collection
exports.readFormattedCardEntries = function(messageContent){
  var result = [];
  var index = 0;
  var lines = messageContent.split(lineSeparator);
  if(lines != null && lines.length > 1){
    lines.forEach(function(line){
      if(line.includes(Config.separator)){
        result[index++] = UserInputParser.parseToCardEntry(line);
      }
    });
  }

  return result;
}
