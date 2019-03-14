const { RichEmbed } = require('discord.js');

fetchHelp = function(page, callback){
  var embed = ''
  if (!page){
    embed = new RichEmbed()
    .setTitle('Commands List')
    .setAuthor('Marv')
    .setDescription('To view usage of specific commands, use `help x` where x is the page with the command you want. e.g. `help scp`')
    .setColor(5577355)
    .addField('scp', 'scp, tales, 001, generate')
    .addField('moderation', 'change_prefix, kick, ban, purge')
    .addField('other', 'help, info, ping')

    callback(embed)
  } else if (page == 'scp'){
    embed = new RichEmbed()
    .setTitle('Commands List: scp')
    .setAuthor('Marv')
    .setDescription('Usage is shown with each command')
    .setColor(5577355)
    .addField('scp', 'Used as `scp x` where x is the scp number you want to find. e.g. `scp 173`')
    .addField('tales', 'Used as `tales x` where x is the full or partial title of the tale you want to search for. e.g. `tales c-sharp`')
    .addField('001', 'Links all scp-001 proposals')
    .addField('generate', 'Generate a fake SCP using ML! Used as `generate x` where x is the desired SCP number! Limited to 5 generations per server per halfhour!')

    callback(embed)
  } else if (page == 'moderation'){
    embed = new RichEmbed()
    .setTitle('Commands List: moderation')
    .setAuthor('Marv')
    .setDescription('Usage is shown with each command')
    .setColor(5577355)
    .addField('change_prefix', 'Changes Marvs prefix for your server. Used as `change_prefix x` where x is the desired prefix. Supports multi-character prefixes.')
    .addField('kick', 'Kicks a specified user. Used as `kick user reason`, reason is optional, user must be a mention (@user) of the user you want to kick.')
    .addField('ban', 'Bans a specified user. Used as `ban user reason`, reason is optional, user must be a mention (@user) of the user you want to ban.')
    .addField('purge', 'Mass deletes messages that pass certain filters. Used as `purge x type user` or `purge x user type` where x is the number of messages to delete. User and type are optional but user must be a mention, type is either `image, img or bot`.')

    callback(embed)
  } else if (page == 'other'){
    embed = new RichEmbed()
    .setTitle('Commands List: other')
    .setAuthor('Marv')
    .setDescription('Usage is shown with each command')
    .setColor(5577355)
    .addField('help', 'Displays the list of command pages.')
    .addField('info', 'Shows info about the bot such as uptime. Also provides a link to the support server.')
    .addField('ping', 'Shows the bots latency to the server and discords API in ms.')

    callback(embed)
  } else {
    embed = 'Not a valid help page.'

    callback(embed)
  }
}
