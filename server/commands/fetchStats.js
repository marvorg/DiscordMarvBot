const { RichEmbed } = require('discord.js')

fetchStats = function (bot, callback) {
  var uptime = timeConverter(bot.uptime)
  var embed = new RichEmbed()
    .setTitle('Info')
    .setAuthor('Marv')
    .setColor(5577355)
    .addField('Uptime', uptime)
    .addField('Guilds This Shard', bot.guilds.size)
    .addField('Channels This Shard', bot.channels.size)
    .addField('Users This Shard', bot.users.size)
    .addField('Support Server', 'https://discord.gg/NEXPCJz')
    .addField('Invite Link', 'https://discordapp.com/oauth2/authorize?client_id=538173713162567690&scope=bot&permissions=125958')

  callback(embed)
}
