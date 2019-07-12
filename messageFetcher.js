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

exports.findHistoricMessage = async function(channel, username, userInput, entryManageFunction, messageHandler){
  var messagePromise = channel.fetchMessages({limit: 100});
  var actualMessages = await messagePromise;
  var foundMessage = false;

  actualMessages.forEach(function(message){
      if(message.content.includes(username)){
        messageHandler(channel, message, username, userInput, entryManageFunction);
        foundMessage = true;
      }
  });

  if(!foundMessage){
    messageHandler(channel, null, username, userInput, entryManageFunction);
  }
}
