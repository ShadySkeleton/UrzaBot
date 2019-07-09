const Discord = require('discord.js');
const client = new Discord.Client();
const CONFIG = require('./config.json');

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', msg => {

 if (msg.content.startsWith('!wants')) {
 msg.reply('pong');
 }

 });

client.login(CONFIG.token);
