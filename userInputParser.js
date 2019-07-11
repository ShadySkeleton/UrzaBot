const CardEntry = require('./cardEntry')

//parse each card by splitting again on "|" character
var parseToCardEntry = function(messageLine){
  var values = messageLine.split("|");
  var count = values[0] == null ? '' : values[0].trim();
  var name = values[1] == null ? '' : values[1].trim();
  var descriptors = values[2] == null ? '' : values[2].trim();

  //if count is not a valid number, set 1 as default (since 0 is highly unlikely in the use-case )
  if(isNaN(count)){
    return CardEntry.create(1, name, descriptors);
  }

  var numericCount = parseInt(count);
  return CardEntry.create(numericCount, name, descriptors);
}

//Split the content without the bot command into individual pieces and parse them each
var parseToCardEntries = function(messageContent){
  var result = [];
  var values = messageContent.split("||");

  var index = 0;
  values.forEach(function(value){
    var part = parseToCardEntry(value);
    result[index++] = parseToCardEntry(value);
  });

  return result;
}

//reads the user input that contains the original card entries
exports.readUserInput = function(messageContent){
  return parseToCardEntries(messageContent);
}
