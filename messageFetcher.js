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
