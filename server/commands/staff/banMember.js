
const { RichEmbed } = require('discord.js')

module.exports = {
  name: 'ban',
  async execute(bot, message, args) {
    var member = message.mentions.members.first()
    if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("You don't have permission to use this command")
    if(!member) return message.channel.send("Please @ someone to ban!")
    if(!member.bannable) return message.channel.send("I cannot ban this user, they must have higher permissions.")

    var reason = args.join(' ')
    if(!reason) reason = "No reason provided"
    await member.ban(reason)
    .then(embed(member, reason))
    .catch(error => console.log(colors.red(error)))
          
 
      function embed(member, reason) {
        embed = new RichEmbed()
        .setTitle('Member banned')
        .setAuthor('Marv')
        .setColor(5577355)
        .setDescription(`Succesfully banned ${member.user.tag}`)
        .addField('Reason', reason)
      }

  }
}