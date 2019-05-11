const { RichEmbed } = require('discord.js');

fetchStats = function(bot, callback){
  var uptime = timeConverter(bot.uptime)
  var embed = new RichEmbed()
  .setTitle('Info')
  .setAuthor('Marv')
  .setColor(5577355)
  .addField("Uptime", uptime)
  .addField("Guilds", bot.guilds.size)
  .addField("Channels", bot.channels.size)
  .addField("Users", bot.users.size)
  .addField("Support Server", "https://discord.gg/NEXPCJz")
  .addField("Invite Link", "https://discordapp.com/oauth2/authorize?client_id=538173713162567690&scope=bot&permissions=125958")

  callback(embed)
}
