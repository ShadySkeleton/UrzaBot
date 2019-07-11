const Discord = require('discord.js')
const Config = require('./config.json')
const Token = require('./token.json')
const CardEntry = require('./cardEntry')
const WantsListManager = require('./wantsListManager')
const UserInputParser = require('./userInputParser')
const BotFormatter = require('./botFormatter')

const client = new Discord.Client();

var findMessageByAuthor = function(channel, username){
  var result;

  channel.messages.forEach(function(message){
      if(message.content.includes(username)){
        result = message;
      }
  });

  return result;
}

var addWants = function(channel, username, content){
  var message = findMessageByAuthor(channel, username);
  var hasPriorMessage = message != null;

  var updatedCollection = [];
  var existingCollection = hasPriorMessage ? BotFormatter.readFormattedCardEntries(message.content) : [];
  var cardCollection = UserInputParser.readUserInput(content);

  if(cardCollection != null && cardCollection.length > 0){
    cardCollection.forEach(function(cardEntry){
      updatedCollection = WantsListManager.addCardEntry(existingCollection, cardEntry);
    });
  }

  var newContent = BotFormatter.formatCardEntries(username, updatedCollection);

  //edit message
  if(hasPriorMessage){
    message.edit(newContent);
  } else{
    channel.send(newContent);
  }
}

var removeWants = function(channel, username, content){
  var message = findMessageByAuthor(channel, username);
  var hasPriorMessage = message != null;

  var updatedCollection = [];
  var existingCollection = hasPriorMessage ? BotFormatter.readFormattedCardEntries(message.content) : [];
  var cardCollection = UserInputParser.readUserInput(content);

  if(cardCollection != null && cardCollection.length > 0){
    cardCollection.forEach(function(cardEntry){
      updatedCollection = WantsListManager.removeCardEntry(existingCollection, cardEntry);
    });
  }

  var newContent = BotFormatter.formatCardEntries(username, updatedCollection);

  //edit message
  if(hasPriorMessage){
    message.edit(newContent);
  } else{
    channel.send(newContent);
  }
}

var removeAllWants = function(channel, username){
  var message = findMessageByAuthor(channel, username);
  if(message != null){
    message.delete();
  }
}

var fetchWantsList = function(channel, author, target){
  var message = findMessageByAuthor(channel, target);
  if(message != null){
    author.sendMessage(message.content);
  } else {
    author.sendMessage('Sorry, but there were no wants for user ' + target)
  }
}

/////////////////////////////////////////////////////////////////
//Discord Program Start//////////////////////////////////////////
client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', msg => {
  if(msg.guild == null){
    return;
  }

  var channel = msg.guild.channels.find(channel => channel.id === Config.channel_id);
  var authorName = msg.member.displayName;

  if(msg.author.username == 'UrzaBot'){
    return;
  }

  //channel.bulkDelete(100);

  var content = msg.content;
  var contentArray = content.split(" ");
   if(contentArray[0] === '!wants'){

    //remove first ten characters to cleanse bot command starter
     if(contentArray[1] === 'add'){
        addWants(channel, authorName, content.substring(10));
     } else if(contentArray[1] === 'remove'){
       removeWants(channel, authorName, content.substring(13));
     } else if(contentArray[1] === 'removeAll'){
       removeAllWants(channel, authorName);
     } else if(contentArray[1] === 'fetch'){
       fetchWantsList(channel, msg.author, content.substring(12));
     }
   }

   msg.delete();
 });

client.login(Token.tokenId);
