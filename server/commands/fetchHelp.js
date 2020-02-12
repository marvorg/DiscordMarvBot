const { RichEmbed } = require('discord.js');
const helpLoc = require('../localisation/help.json');
//const helpStrings = JSON.parse(helpLoc);

fetchHelp = function(page, lang, callback){
  var embed = ''
  const langStrings = helpLoc[lang]
  if (!page){
    embed = new RichEmbed()
    .setTitle(langStrings["BASE"].TITLE)
    .setAuthor('Marv')
    .setDescription(langStrings["BASE"].DESCRIP)
    .setColor(5577355)
    .addField('scp', 'scp, tales, 001, generate')
    .addField('moderation', 'change_prefix, kick, ban, purge')
    .addField('other', 'help, info, ping')

    callback(embed)

  } else if (page == 'scp'){
    embed = new RichEmbed()
    .setTitle(langStrings["SCP"].TITLE)
    .setAuthor('Marv')
    .setDescription(langStrings["SCP"].DESCRIP)
    .setColor(5577355)
    .addField('scp', langStrings["SCP"].SCP)
    .addField('tales', langStrings["SCP"].TALES)
    .addField('001', langStrings["SCP"].PROP)
    .addField('generate', langStrings["SCP"].GENERATE)

    callback(embed)

  } else if (page == 'moderation'){
    embed = new RichEmbed()
    .setTitle(langStrings["MOD"].TITLE)
    .setAuthor('Marv')
    .setDescription(langStrings["MOD"].DESCRIP)
    .setColor(5577355)
    .addField('change_prefix', langStrings["MOD"].PREFIX)
    .addField('kick', langStrings["MOD"].KICK)
    .addField('ban', langStrings["MOD"].BAN)
    .addField('purge', langStrings["MOD"].PURGE)
    .addField('language', langStrings["MOD"].LANG)

    callback(embed)

  } else if (page == 'other'){
    embed = new RichEmbed()
    .setTitle(langStrings["OTHER"].TITLE)
    .setAuthor('Marv')
    .setDescription(langStrings["OTHER"].DESCRIP)
    .setColor(5577355)
    .addField('help', langStrings["OTHER"].HELP)
    .addField('info', langStrings["OTHER"].INFO)
    .addField('ping', langStrings["OTHER"].PING)

    callback(embed)

  } else {
    embed = 'Not a valid help page.'

    callback(embed)
  }
}
