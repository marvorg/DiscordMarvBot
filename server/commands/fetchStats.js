const { RichEmbed } = require('discord.js');

fetchStats = function(bot, callback){
  let totalSeconds = (bot.uptime / 1000);
  let days = Math.floor(totalSeconds / 86400);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let uptime = `${Math.round(days)} days, ${Math.round(hours)} hours, ${Math.round(minutes)} minutes and ${Math.round(seconds)} seconds`;
  var embed = new RichEmbed()
  .setTitle('Info')
  .setAuthor('Marv')
  .setColor(5577355)
  .addField("Uptime", uptime)
  .addField("Guilds", bot.guilds.size)
  .addField("Channels", bot.channels.size)
  .addField("Users", bot.users.size)
  .addField("Support Server", "https://discord.gg/NEXPCJz")

  callback(embed)
}
