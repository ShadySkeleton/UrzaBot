const Discord = require('discord.js')
const Config = require('./config.json')
const Token = require('./token.json')
const CardEntry = require('./cardEntry')
const WantsListManager = require('./wantsListManager')
const UserInputParser = require('./userInputParser')
const BotFormatter = require('./botFormatter')

const client = new Discord.Client();

var findMessageByAuthor = function(channel, authorName){
  var result;

  channel.messages.forEach(function(message){
      if(message.content.includes(authorName)){
        result = message;
      }
  });

  return result;
}

var addWants = function(channel, author, content){
  var authorLine = 'Wants of ' + author;

  var message = findMessageByAuthor(channel, author.username);
  var hasPriorMessage = message != null;

  var updatedCollection = [];
  var existingCollection = hasPriorMessage ? BotFormatter.readFormattedCardEntries(message.content) : [];
  var cardCollection = UserInputParser.readUserInput(content);

  if(cardCollection != null && cardCollection.length > 0){
    cardCollection.forEach(function(cardEntry){
      updatedCollection = WantsListManager.addCardEntry(existingCollection, cardEntry);
    });
  }

  var newContent = BotFormatter.formatCardEntries(author, updatedCollection);

  //edit message
  if(hasPriorMessage){
    message.edit(newContent);
  } else{
    channel.send(newContent);
  }
}

var removeWants = function(channel, author, content){
  var message = findMessageByAuthor(channel, author.username);
  var hasPriorMessage = message != null;

  var updatedCollection = [];
  var existingCollection = hasPriorMessage ? BotFormatter.readFormattedCardEntries(message.content) : [];
  var cardCollection = UserInputParser.readUserInput(content);

  if(cardCollection != null && cardCollection.length > 0){
    cardCollection.forEach(function(cardEntry){
      updatedCollection = WantsListManager.removeCardEntry(existingCollection, cardEntry);
    });
  }

  var newContent = BotFormatter.formatCardEntries(author, updatedCollection);

  //edit message
  if(hasPriorMessage){
    message.edit(newContent);
  } else{
    channel.send(newContent);
  }
}

var removeAllWants = function(channel, author){
  var message = findMessageByAuthor(channel, author.username);
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
  var author = msg.author;

  if(author === 'UrzaBot'){
    return;
  }

  //channel.bulkDelete(100);

  var content = msg.content;
  var contentArray = content.split(" ");
   if(contentArray[0] === '!wants'){

    //remove first ten characters to cleanse bot command starter
     if(contentArray[1] === 'add'){
        addWants(channel, author, content.substring(10));
     } else if(contentArray[1] === 'remove'){
       removeWants(channel, author, content.substring(13));
     } else if(contentArray[1] === 'removeAll'){
       removeAllWants(channel, author);
     } else if(contentArray[1] === 'fetch'){
       fetchWantsList(channel, author, content.substring(12));
     }
   }

   if(author !== 'UrzaBot'){
      //msg.delete();
   }
 });

client.login(Token.tokenId);
