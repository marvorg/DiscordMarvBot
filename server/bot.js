const Discord = require('discord.js');
const bot = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL(process.env.BOTLIST_TOKEN, bot);
const { RichEmbed } = require('discord.js');

// Sets bots activity to display amount of servers
function activity(){
  bot.user.setActivity(`Serving ${bot.guilds.size} servers | %help`)
}

// Commands will only run after this
bot.on('ready', () => {
  console.log(`Started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers`);
  activity();

  setInterval(() => {
    dbl.postStats(bot.guilds.size);
  }, 1800000);
});

bot.on('guildCreate', guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). With ${guild.membercount} members`);
  logGuild('Added to Guild!', guild, 'added')
  activity();
});

bot.on('guildDelete', guild => {
  console.log(`Removed from: ${guild.name} (id: ${guild.id})`);
  logGuild('Removed from Guild!', guild, 'removed')
  activity();
});

bot.on('message', async message => {

  // Prevents replies to other bots
  if(message.author.bot) return;
  var prefix = ''

  if(settings.findOne({_id:message.guild.id})){
    prefix = settings.findOne({_id:message.guild.id}).prefix
  }else{
    prefix = '%'
  }

  if (message.isMentioned(bot.user)) {
    message.channel.send('Your prefix is: '+prefix);
  }

  // Prevents replies to un-prefixed messages
  if(message.content.substring(0, prefix.length) != prefix) return;

  var args = message.content.slice(prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();

  if(command == 'scp') {
    var num = args[0]
    fetchSCP(num, function(data){
      message.channel.send(data);
    })
  }

  else if (command == 'tales'){
    var input = message.content.split('tales')[1].trim()
    fetchTales(input, function(data){
      message.channel.send(data);
    })
  }

  else if (command == '001'){
    var proposals = fetchProposals()
    message.channel.send(proposals);
  }

  else if (command == "change_prefix"){

    // Prevents certain users from changing the prefix in a server
    if(message.member.hasPermission("MANAGE_GUILD")) {
      var new_prefix = args[0]
      if(new_prefix.length >= 500){
        new_prefix = new_prefix.substring(0, 500)
      }
      // do we already have a prefix?
      if(settings.findOne({_id:message.guild.id})){
        // lets update it
        settings.update({_id:message.guild.id}, {$set:{prefix:new_prefix}})
      }else{
        // nop lets insert it
        settings.insert({_id:message.guild.id, prefix:new_prefix})
      }
      message.channel.send("Prefix set to: "+new_prefix);
    }else{
      message.channel.send("You need the manage guild permission to use that command!")
    }
  }

  else if (command == 'info'){
    fetchStats(bot, function(data){
      message.channel.send(data)
    })
  }

  else if (command == 'ping') {
    // Finds ping by checking when the 'Ping?' message is sent against when the command message was sent
    const m = await message.channel.send('Ping?');
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
  }

  else if (command == 'help'){
    var page = args[0]
    fetchHelp(page, function(data){
      message.channel.send(data)
    })
  }

  else if (command == 'sysinfo'){
    fetchSysInfo(function(data){
      message.channel.send(data)
    })
  }

  else if (command == 'gregg_rulz'){
    message.channel.send('ok')
  }

  else if (command == 'generate'){
    var input = message.content.split('generate')[1].trim()

    var embed = shortPreProcessing(message)
    const m = await message.channel.send(embed[1]);

    if(embed[0] != 'fail'){
      generateShort(input, function(data){
        m.delete();
        if(data){
          message.channel.send('Hey <@'+embed[2]+'> Heres your story!')
          message.channel.send(data)
        }else{
          message.channel.send('Error: Must be a number ( up to 5 digits )')
        }
      })
    }
  }

  else if (command == 'purge'){
    var amount = ''
    var type
    var user = message.mentions.users.first()
    var ment
    var userID
    if(message.member.hasPermission("MANAGE_GUILD")){
      if (Number(args[0]) == 'NaN'){
        message.channel.send('First arg of `purge` should be a number')
      } else {
        amount = parseInt(args[0])
        if (amount > 100){
          message.channel.send('Can only delete up to 100 messages')
        } else {
          if (args[1]){
            if (args[1] == 'image' || args[1] == 'img' || args[1] == 'bot'){
              type = args[1]
              console.log(type, args[1])
            } else if (user) {
              ment = message.guild.member(user)
              userID = ment.id
            } else {
              message.channel.send('Second arg should be `image, img, bot` or a user mention')
            }
            if (args[2]){
              if (args[2] == 'image' || args[2] == 'img' || args[2] == 'bot'){
                type = args[2]
              } else if (user){
                ment = message.guild.member(user)
                userID = ment.id
              } else {
                message.channel.send('Third arg should be `image, img, bot` or a user mention')
              }
            }
          }
        }
      }
      purge(amount, type, userID, message, function(data){

        if (data == 'base'){
          message.channel.bulkDelete(amount)
        } else {
          if (data.size > 1){
            message.channel.bulkDelete(data)
          } else if (data.size == 1){
            var id = String(data.firstKey(1))
            message.channel.fetchMessage(id).then(message => message.delete())
          } else {
            message.channel.send('No messages found for purging')
          }
        }
        message.delete(1000)
      })
    } else {
      message.channel.send('You need the manage guild permission to use that command!')
    }
  }

  else if (command == 'kick'){
    if(message.member.hasPermission("MANAGE_GUILD")){
      var user = message.mentions.users.first()
      var check = message.guild.member(user)
      if (!user){
        message.channel.send('Please specify a user to kick.')
      } else {
        if (message.member.highestRole.comparePositionTo(check.highestRole) <= 0){
          message.channel.send(`You can't kick that member`)
        } else {
          args.shift()
          var reason = args.join(' ')
          kickMember(check, reason, function(data){
            message.channel.send(data)
          })
        }
      }
    } else {
      message.channel.send('You need the manage guild permission to use that command!')
    }
  }

  else if (command == 'ban'){
    if(message.member.hasPermission("MANAGE_GUILD")){
      var user = message.mentions.users.first()
      var check = message.guild.member(user)
      if (!user){
        message.channel.send('Please specify a user to ban.')
      } else {
        if (message.member.highestRole.comparePositionTo(check.highestRole) <= 0){
          message.channel.send(`You can't ban that member.`)
        } else {
          args.shift()
          var reason = args.join(' ')
          banMember(check, reason, function(data){
            message.channel.send(data)
          })
        }
      }
    } else {
      message.channel.send('You need the manage guild permission to use that command!')
    }
  }

  else{
    message.channel.send('Thats not a valid command, use `help` to view commands.');
  }

});

// Restarts on a full disconnect
bot.on('disconnected', function() {
  logDisconnect()
  console.log('disconnected!')
  bot.login(process.env.DISCORD_TOKEN).catch(function(err){
    console.log('failed to reconnect!')
    const exec = require("child_process").exec
    exec("restart marv")
  })
});

bot.on('error', console.error);

bot.login(process.env.DISCORD_TOKEN);
