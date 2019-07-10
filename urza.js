const Discord = require('discord.js');
const Config = require('./config.json');
const Token = require('./token.json');
const CardEntry = require('./cardEntry')

const client = new Discord.Client();

/////////////////////////////////////////////////////////////////
//General Functions/////////////////////////////////////////////
var findMessageByAuthor = function(channel, author){
  var result;

  channel.messages.forEach(function(message){
      if(message.content.includes(author)){
        console.log('Found one');
        result = message;
      }
  });

  return result;
}

//parse each card by splitting again on "|" character
var parseToCardEntry = function(rawLine){
  var values = rawLine.split("|");
  var count = values[0] === null ? '' : values[0].trim();
  var name = values[1] === null ? '' : values[1].trim();
  var descriptors = values[2] === null ? '' : values[2].trim();

  return CardEntry.create(count, name, descriptors);
}

//Split the content without the bot command into individual pieces and parse them each
var parseToCardEntries = function(completeContent){
  var result = [];
  var values = completeContent.split("||");

  var index = 0;
  values.forEach(function(value){
    result[index++] = parseToCardEntry(value);
  });

  return result;
}

//formats text to string
var formatCardEntry = function(cardEntry){
  return cardEntry.count + 'x ' + cardEntry.name + ' (' + cardEntry.descriptors + ')'
}

/////////////////////////////////////////////////////////////////
//Want editing functions/////////////////////////////////////////
var addWants = function(channel, author, content){
  //find message for correct author
  //if no author, add additional line "Wants for "
  var newContent;
  var hasPriorMessage;
  var message = findMessageByAuthor(channel, author);
  if(typeof message === "undefined"){
    newContent = 'Wants of ' + author;
    hasPriorMessage = false;
  } else {
    newContent = message.content;
    hasPriorMessage = true;
  }

  //parse content to cards
  //get message content, add cards content
  var cardEntries = parseToCardEntries(content);
  cardEntries.forEach(function(entry){
    console.log(formatCardEntry(entry));
    newContent += '\r\n' + formatCardEntry(entry);
  });

  //edit message
  if(hasPriorMessage){
    message.edit(newContent);
  } else{
    channel.sendMessage(newContent);
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
  var author = msg.author.username;

  if(author === 'UrzaBot'){
    return;
  }

  //channel.bulkDelete(100);
  //if(author === 'ShadySkeleton'){
    //msg.reply(channel.type);
    //msg.reply(channel.lastMessage.content);
  //}

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
 });

client.login(Token.tokenId);
