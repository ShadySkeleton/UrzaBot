const CardEntry = require('./cardEntry')

var handleShortHand = function(messageLine){
  var value = messageLine.trim();
  var testChar = value.substring(0,1);
  if(isNaN(testChar)){
    return CardEntry.create(1, messageLine, '---', '');
  } else {
    var splitIndex = value.indexOf(" ");
    var count = parseInt(value.substring(0, splitIndex));

    return CardEntry.create(count, value.substring(splitIndex+1, value.length).trim(), '---', '');
  }
}

//parse each card by splitting again on "|" character
var parseInputToCardEntry = function(messageLine){
  //only a single value, should be interpreted as a card name
  if(!messageLine.includes("|")){
    return handleShortHand(messageLine);
  }

  var values = messageLine.split("|");
  var count = values[0] == null ? '' : values[0].trim();
  var edition = values[1] == null ? '' : values[1].trim();
  var name = values[2] == null ? '' : values[2].trim();
  var descriptors = values[3] == null ? '' : values[3].trim();

  //if count is not a valid number, set 1 as default (since 0 is highly unlikely in the use-case )
  if(isNaN(count)){
    return CardEntry.create(1, name, edition, descriptors);
  }

  var numericCount = parseInt(count);
  return CardEntry.create(numericCount, name, edition, descriptors);
}

exports.parseToCardEntry = function(messageLine){
  return parseInputToCardEntry(messageLine)
}

//Split the content without the bot command into individual pieces and parse them each
var parseToCardEntries = function(messageContent){
  var result = [];
  var values = messageContent.split("/r/n");

  var index = 0;
  values.forEach(function(value){
    result[index++] = parseInputToCardEntry(value);
  });

  return result;
}

//reads the user input that contains the original card entries
exports.readUserInput = function(messageContent){
  return parseToCardEntries(messageContent);
}
