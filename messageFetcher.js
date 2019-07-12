//message that fetches past messages of the author
//TODO: this really needs to be updated to fetch all historic messages of the channel
exports.findMessageByAuthor = function(channel, username){
  var result;

  channel.messages.forEach(function(message){
      if(message.content.includes(username)){
        result = message;
      }
  });

  return result;
}

exports.findHistoricMessage = async function(channel, username, message, userInput, entryManageFunction, messageHandler){
  var messagePromise = channel.fetchMessages({limit: 100});
  var actualMessages = await messagePromise;
  var foundMessage = false;

  actualMessages.forEach(function(message){
      if(message.content.includes(username)){
        console.log("Found a message");
        messageHandler(message, username, userInput, entryManageFunction);
        foundMessage = true;
      }
  });

  if(!foundMessage){
    console.log("Executing without prior message");
    messageHandler(null, username, userInput, entryManageFunction);
  }

}
