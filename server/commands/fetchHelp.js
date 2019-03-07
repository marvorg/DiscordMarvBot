const { RichEmbed } = require('discord.js');

fetchHelp = function(callback){
  var embed = new RichEmbed()
  .setTitle('Commands List')
  .setAuthor('Marv')
  .setDescription('Usage is shown with each command')
  .setColor(5577355)
  .addField("help", "Displays this message")
  .addField("scp", "Used as `scp x` where x is the scp number. Supports 'random', used as `scp random`")
  .addField("tales", "Used as `tales x` where x is the title. Supports partial titles ex: `tales bearl-ly thought`. Supports 'random', used as `tales random`")
  .addField("001", "Links all the 001 proposals")
  .addField("info", "Displays information about the bot such as amount of users")
  .addField("ping", "Returns the bots ping in ms")
  .addField("change_prefix", "Changes the bots prefix. Used as `change_prefix x` where x is the desired prefix")
  .addField("generate", "Generate a fake SCP using ML! Used as `generate x` where 'x' is the desired SCP number! Limited to 5 generations per server per halfhour!")

  callback(embed)
}
