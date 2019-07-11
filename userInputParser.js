const CardEntry = require('./cardEntry')

//parse each card by splitting again on "|" character
var parseToCardEntry = function(messageLine){
  //only a single value, should be interpreted as a card name
  if(!messageLine.includes("|")){
    return CardEntry.create(1, messageLine, '', '');
  }

  var values = messageLine.split("|");
  var count = values[0] == null ? '' : values[0].trim();
  var name = values[1] == null ? '' : values[1].trim();
  var edition = values[2] == null ? '' : values[2].trim();
  var descriptors = values[3] == null ? '' : values[3].trim();

  //if count is not a valid number, set 1 as default (since 0 is highly unlikely in the use-case )
  if(isNaN(count)){
    return CardEntry.create(1, name, edition descriptors);
  }

  var numericCount = parseInt(count);
  return CardEntry.create(numericCount, name, edition, descriptors);
}

//Split the content without the bot command into individual pieces and parse them each
var parseToCardEntries = function(messageContent){
  var result = [];
  var values = messageContent.split("/r/n");

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
