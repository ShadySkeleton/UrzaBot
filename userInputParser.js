const CardEntry = require('./cardEntry')

//parse each card by splitting again on "|" character
var parseToCardEntry = function(messageLine){
  var values = messageLine.split("|");
  var count = values[0] == null ? '' : values[0].trim();
  var name = values[1] == null ? '' : values[1].trim();
  var descriptors = values[2] == null ? '' : values[2].trim();

  return CardEntry.create(count, name, descriptors);
}

//Split the content without the bot command into individual pieces and parse them each
var parseToCardEntries = function(messageContent){
  var result = [];
  var values = messageContent.split("||");

  var index = 0;
  values.forEach(function(value){
    result[index++] = parseToCardEntry(value);
  });

  return result;
}

//reads the user input that contains the original card entries
exports.readRawCardEntries = function(messageContent){
  return parseToCardEntries(messageContent);
}
