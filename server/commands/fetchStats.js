const { RichEmbed } = require('discord.js');

fetchStats = function(bot, callback){
  var embed = new RichEmbed()
  .setTitle('Info')
  .setAuthor('Marv')
  .setColor(5577355)
  .addField("Guilds", bot.guilds.size)
  .addField("Channels", bot.channels.size)
  .addField("Users", bot.users.size)
  .addField("Support Server", "https://discord.gg/NEXPCJz")

  callback(embed)
}
