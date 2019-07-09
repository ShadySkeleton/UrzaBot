const Discord = require('discord.js');
const client = new Discord.Client();
const CONFIG = require('./config.json');
const TOKEN = require('./token.json');

var addWants = function(channel, values){
  values.forEach(function(value){
    if(values.indexOf(value) > 1){
      //iterating over the content of the wants add
      channel.sendMessage(value);
    }
  });
}

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', msg => {
  var content = msg.content;
  var yourchannel = msg.guild.channels.find(channel => channel.id === CONFIG.channel_id);
  var contentArray = content.split(" ");
   if(contentArray[0] === '!wants'){

     if(contentArray[1] === 'add'){
        addWants(yourchannel, contentArray);
     } else if(contentArray[1] === 'remove'){
       const yourchannel = msg.guild.channels.find(channel => channel.id === CONFIG.channel_id);
       yourchannel.sendMessage('Test');
     } else if(contentArray[2] === 'removeAll'){
       const yourchannel = msg.guild.channels.find(channel => channel.id === CONFIG.channel_id);
       yourchannel.sendMessage('Test');
     }
   }
 });

client.login(TOKEN.tokenId);
