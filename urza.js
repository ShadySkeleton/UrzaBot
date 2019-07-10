const Discord = require('discord.js')
const Config = require('./config.json')
const Token = require('./token.json')
const CardEntry = require('./cardEntry')
const WantsListManager = require('./wantsListManager')
const UserInputParser = require('./userInputParser')
const BotFormatter = require('./botFormatter')

const client = new Discord.Client();

/////////////////////////////////////////////////////////////////
//General Functions/////////////////////////////////////////////
var findMessageByAuthor = function(channel, author){
  var result;
  var authorName = author.username;

  channel.messages.forEach(function(message){
      if(message.content.includes(authorName)){
        result = message;
      }
  });

  return result;
}

/////////////////////////////////////////////////////////////////
//Want editing functions/////////////////////////////////////////
var addWants = function(channel, author, content){
  //use as title for embed
  var authorLine = 'Wants of ' + author;

  var message = findMessageByAuthor(channel, author);
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
//find message by author
//find content line with same card name
//get complete content, remove that line from string
//edit message
}

var removeAllWants = function(channel, author){
  var message = findMessageByAuthor(channel, author);
  if(message != null){
    message.delete();
  }
}

/////////////////////////////////////////////////////////////////
//Discord Program Start//////////////////////////////////////////
client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', msg => {
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
     }
   }

   if(author !== 'UrzaBot'){
      //msg.delete();
   }
 });

client.login(Token.tokenId);
