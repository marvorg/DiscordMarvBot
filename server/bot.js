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

//When a server is joined
bot.on('guildCreate', guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). With ${guild.membercount} members`);
  logGuild('Added to Guild!', guild, 'added')
  activity();
});

//When removed from a server
bot.on('guildDelete', guild => {
  console.log(`Removed from: ${guild.name} (id: ${guild.id})`);
  logGuild('Removed from Guild!', guild, 'removed')
  activity();
});

//When a message is sent
bot.on('message', async message => {
  // Prevents replies to other bots
  if(message.author.bot) return;

  //Finds the prefix for the guild, or uses the default if no custom prefix is set
  var prefix = '%'
  if(settings.findOne({_id:message.guild.id})){
    prefix = settings.findOne({_id:message.guild.id}).prefix
  }

  //Replies to mentions with the servers prefix
  if (message.isMentioned(bot.user)) {
    message.channel.send('Your prefix is: '+prefix);
  }

  // Prevents replies to un-prefixed messages
  if(message.content.substring(0, prefix.length) != prefix) return;

  var args = message.content.slice(prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();

  switch (command){
    case "scp":

      var num = args[0]
      fetchSCP(num, function(data){
        message.channel.send(data);
      })
      break;

    case "tales":

      var input = message.content.split('tales')[1].trim()
      fetchTales(input, function(data){
        message.channel.send(data);
      })
      break;

    case "001":

      var proposals = fetchProposals()
      message.channel.send(proposals);
      break;

    case "change_prefix":

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
      break;

    case "info":

      fetchStats(bot, function(data){
        message.channel.send(data)
      })
      break;

    case "ping":

      // Finds ping by checking when the 'Ping?' message is sent against when the command message was sent
      var m = await message.channel.send('Ping?');
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
      break;

    case "help":

      var page = args[0]
      fetchHelp(page, function(data){
        message.channel.send(data)
      })
      break;

    case "sysinfo":

      fetchSysInfo(function(data){
        message.channel.send(data)
      })
      break;

    case "generate":

      var input = message.content.split('generate')[1].trim()

      var embed = shortPreProcessing(message)
      var m = await message.channel.send(embed[1]);

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
      break;

    case "purge":

      var amount = ''
      var type
      var user = message.mentions.users.first()
      var ment
      var userID
      var correct_inputs = true

      if(message.member.hasPermission("MANAGE_GUILD")){
        var types = ['image', 'img', 'bot']
        var user = message.mentions.users.first()
        var memb
        var amount
        var type

        //Check for amount of messages to delete, and the type, by searching through all stored args
        args.forEach(function(item, index, array){
          if (isNaN(item) == false){
            amount = Number(item)
          } else if (types.includes(item) == true) {
            type = item
          }
        })

        //If theres a user mention, check if theyre in the guild
        if (user){
          memb = message.guild.member(user)
          if (!memb){
            message.channel.send(`That user isn't in this server.`)
          } else {
            userID = memb.id
          }
        }

        //Makes sure an amount is given and is less than or equal to 100
        if (amount && amount <= 100){
          purge(amount, type, userID, message, function(msgs){
            if (msgs.size > 1){
              message.channel.bulkDelete(msgs)
            } else if (msgs.size == 1){
              var id = String(msgs.firstKey(1))
              message.channel.fetchMessage(id).then(m => m.delete())
            } else {
              message.channel.send('No messages found for purging.')
            }
          })
        } else {
          message.channel.send('Please specify an amount of messages to delete (100 max)')
        }
      } else {
        message.channel.send('You need the manage guild permission to use that command!')
      }
      break;

    case "kick":

      if(message.member.hasPermission("MANAGE_GUILD")){
        var user = message.mentions.users.first()
        var check = message.guild.member(user)
        //If no user is mentioned
        if (!user){
          message.channel.send('Please specify a user to kick.')

        } else {
          //If the member they try to kick is higher ranking than them
          if (message.member.highestRole.comparePositionTo(check.highestRole) <= 0){
            message.channel.send(`You can't kick that member`)

          } else {
            //Removes the mention then joins other args together for the reason
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
      break;

    case "ban":

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
      break;

    default:
      message.channel.send('Thats not a valid command, use `help` to view commands.');
  }
});

// Restarts on a full disconnect, after attempting to re-login
bot.on('disconnected', function() {
  logDisconnect()
  const exec = require("child_process").exec
  exec("restart marv")
});

bot.on('error', function(error){
  logError(error)
});

bot.login(process.env.DISCORD_TOKEN);
