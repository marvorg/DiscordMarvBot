const { RichEmbed } = require('discord.js')

banMember = function(member, reason, callback){
  var embed = ''
  var delReason = {reason:1}
  //Makes sure the person is actually a member of the guild
  if (member){
    member.ban(delReason).then(() => {
      embed = new RichEmbed()
      .setTitle('Member banned')
      .setAuthor('Marv')
      .setColor(5577355)
      .setDescription(`Succesfully banned ${member.user.tag}`)
      .addField('Reason', reason)

      callback(embed)

    }).catch(err => {
      console.log(err)
      //Usually due to the bot having lower perms than the person that was going to be kicked
      embed = 'Unable to ban that member'
      callback(embed)
    })

  } else {
    embed = `That user isn't in this guild`
    callback(embed)
  }
}
