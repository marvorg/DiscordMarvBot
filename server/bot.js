const Discord = require('discord.js');
const bot = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL(process.env.BOTLIST_TOKEN, bot);

function activity(){
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`)
}

bot.on('ready', () => {
  console.log(`Started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers`);
  activity();

  setInterval(() => {
    dbl.postStats(bot.guilds.size);
  }, 1800000);
});

bot.on('guildCreate', guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). With ${guild.membercount} members`);
  activity();
});

bot.on('guildDelete', guild => {
  console.log(`Removed from: ${guild.name} (id: ${guild.id})`);
  logGuild('Removed from Guild!', guild)
  activity();
});

bot.on('message', async message => {
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
    if (args[0] == null) {
      var proposals = fetchProposals()
      message.channel.send(proposals);
    }
  }

  else if (command == "change_prefix"){
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
    const m = await message.channel.send('Ping?');
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
  }

  else if (command == 'help'){
    fetchHelp(function(data){
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

  else{
    message.channel.send('Thats not a valid command, use `help` to view commands.');
  }

});

bot.on('disconnected', function() {
  const exec = require("child_process").exec
  exec("restart marv")
});

bot.login(process.env.DISCORD_TOKEN);
