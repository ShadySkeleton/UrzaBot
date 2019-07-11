const Discord = require('discord.js')
const Config = require('./config.json')
const Token = require('./token.json')
const CardEntry = require('./cardEntry')
const WantsListManager = require('./wantsListManager')
const UserInputParser = require('./userInputParser')
const BotFormatter = require('./botFormatter')
const MessageFetcher = require('./messageFetcher')

const client = new Discord.Client();

//function delegate that executes a given function on a wants list
var manageWants = function(channel, username, content, manageFunction){
  var message = MessageFetcher.findMessageByAuthor(channel, username);
  var hasPriorMessage = message != null;

  var updatedCollection = [];
  var existingCollection = hasPriorMessage ? BotFormatter.readFormattedCardEntries(message.content) : [];
  var cardCollection = UserInputParser.readUserInput(content);

  if(cardCollection != null && cardCollection.length > 0){
    cardCollection.forEach(function(cardEntry){
      updatedCollection = manageFunction(existingCollection, cardEntry);
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

//delegating function to determine actual function that is executed
var addWants = function(channel, username, content){
  manageWants(channel, username, content, WantsListManager.addCardEntry);
}

//delegating function to determine actual function that is executed
var removeWants = function(channel, username, content){
  manageWants(channel, username, content, WantsListManager.removeCardEntry);
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
  if(msg.guild == null || msg.author.username == 'UrzaBot'){
    return;
  }

  var channel = msg.guild.channels.find(channel => channel.id === Config.channel_id);
  var authorName = msg.member.displayName;

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
