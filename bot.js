const Discord = require('discord.js');
const config = require('./config.json');
const cheerio = require('cheerio');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;

const bot = new Discord.Client();

function check_prefix(server, callback){
  MongoClient.connect("mongodb://localhost:27017", function(err, client) {
    if(err) {
      return console.dir(err);
    }

    var db = client.db('marv')
    var conf = db.collection('config')

    conf.findOne({'_id': server}, function(err, doc) {
      if(doc){
        callback(doc);
      }
      else {
        callback(null);
      }
      client.close()
    });
  });
}

function change_prefix(server, trigger){
  MongoClient.connect("mongodb://localhost:27017", function(err, client) {
    if(err) {
      return console.dir(err);
    }

    var db = client.db('marv')
    var conf = db.collection('config')

    conf.findOne({'_id': server}, function(err, doc) {
      if(doc) {
        conf.update({'_id': server}, {$set:{'trigger': trigger}})
      }
      else {
        conf.insert({'_id': server, 'trigger': trigger})
      }
      client.close()
    });
  });
}

bot.on('ready', () => {
  console.log(`Started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on('guildCreate', guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). With ${guild.membercount} members`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on('guildDelete', guild => {
  console.log(`Removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on('message', async message => {
  if(message.author.bot) return;

  var server = message.guild.id;

  check_prefix(server, function(cb){
    var prefix = cb;

    if(prefix == null){
      prefix = config.prefix
    }

    if(message.content.charAt(0) != prefix) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'scp') {
      var num = args[0]
      if (num == 'random'){
        num = String(Math.floor(Math.random()*(4999-001+1)+001)).padStart(3,'0')
      }
      var link = 'http://www.scp-wiki.net/scp-' + num
      var text = ''

      request(link, function(error,response,html){
        if (!error && response.statusCode == 200){
          const $ = cheerio.load(html);
          $( "#page-content p" ).each(function(i) {
            if ((i == 5)||(i == 2 && num == '001')) {
              return false;
            }

            text = text+$(this).text()+'\n\n'

            // are we longer than 2000 chars?
            if (text.legnth > 2000) {
              // yup. Lets truncate to 1997 and add some fancy elipsis!
              text = text.substr(0, 1997)+'...'
            }
          });
        } else{
          text = error
        }
        if (text == null){
          message.channel.send('That scp doesn\'t exist, use `help scp` for info on the command');

        } else{
          message.channel.send(`\`\`\`${text} \`\`\` ${link}`);
        }
      });
    }
    else if (command == 'help') {
      if (args[0] == null) {
        message.channel.send('Commands: `help, scp, ping`, for help with a specific command use ```help command```');
      }

      else if(args[0] == 'scp') {
        message.channel.send('Usage: `scp x` where x is a number or random. \n\n Note most scps use a 3 character number, e.g. 001 or 010');
      }

      else if(args[0] == 'ping') {
        message.channel.send('Checks my current ping');
      }

      else if(args[0] == 'help') {
        message.channel.send('Displays a list of all commands or shows usage of one command, but you probably know this already');
      }
    }

    else if (command == 'ping') {
      const m = await message.channel.send('Ping?');
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
    }
    else if (command == 'settings') {
      if(message.member.hasPermission("MANAGE_GUILD") == true) {
        if(args[0] == null) {
          message.channel.send('The prefix for this server is' + prefix);
        }
        else if(args[0] == 'prefix') {
          var newpre = args[1];
          change_prefix(server, newpre);
          message.channel.send('Prefix changed to: ' + newpre);
        }
      }
      else {
        message.channel.send('You need the manage server permission to use that command!');
      }
    }

    else{
      message.channel.send('Thats not a valid command, use `help` to view commands.');
    }
  })

});

bot.login(config.token);
