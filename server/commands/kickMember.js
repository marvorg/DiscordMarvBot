const { RichEmbed } = require('discord.js')

kickMember = function(member, reason, callback){
  var embed = ''
  if (member){
    member.kick(reason).then(() => {
      embed = new RichEmbed()
      .setTitle('Member kicked')
      .setAuthor('Marv')
      .setColor(5577355)
      .setDescription(`Succesfully kicked ${member.user.tag}`)
      .addField('Reason', reason)

      callback(embed)
    }).catch(err => {
      console.log(err)
      embed = 'Unable to kick that member'
      callback(embed)
    })
  } else {
    embed = `That user isn't in this guild`
    callback(embed)
  }
}
