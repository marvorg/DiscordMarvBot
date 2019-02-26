#!/usr/bin/env node
const Discord = require('discord.js');
const config = require('./config.json');
const cheerio = require('cheerio');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const { createLogger, format, transports } = require('winston');
require('winston-mongodb');
const bot = new Discord.Client();
const si = require('systeminformation');
var os = require('os');

// this is our winston logger obj
logger = createLogger({
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.MongoDB({
      db: 'mongodb://localhost:27017/marv',
      capped: true,
      collection: 'winstonLogs',
      handleExceptions: true,
      storeHost: false,
    })
  ],
  exitOnError: false, // do not exit on handled exceptions
});

function activity(){
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`)
}

bot.on('ready', () => {
  console.log(`Started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers`);
  activity();
});

bot.on('guildCreate', guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). With ${guild.membercount} members`);
  logger.log({
    level: 'info',
    message: 'Added to Server!',
    meta: {
      type:'added',
      guild_name: guild.name,
      guild_id: guild.id,
      guild_member_count: guild.membercount,
      date: new Date()
    }
  });
  activity();
});

bot.on('guildDelete', guild => {
  console.log(`Removed from: ${guild.name} (id: ${guild.id})`);
  logger.log({
    level: 'info',
    message: 'Removed from Server!',
    meta: {
      type:'removed',
      guild_name: guild.name,
      guild_id: guild.id,
      guild_member_count: guild.membercount,
      date: new Date()
    }
  });
  activity();
});

bot.on('message', async message => {
  if(message.author.bot) return;

  var server = message.guild.id;
  var prefix = config.prefix

  if(message.content.charAt(0) != prefix) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  console.log(command)
  console.log(command == 'help')


  function fetchEntry(link, num, title){
    var text = ''
    var title = title
    request(link, function(error,response,html){
      if (!error && response.statusCode == 200){
        const $ = cheerio.load(html);
        $( "#page-content p" ).each(function(i) {
          if (num && num == '001' && i == 2){
            return false
          }
          if (i == 5) {
            return false;
          }
          text = text+$(this).text()+'\n\n'
        });

        // are we longer than 2000 chars?
        if (text.length >= 2000) {
          // yup. Lets truncate to 1997 and add some fancy elipsis!
          text = text.substr(0, 1997)+'...'
        }
      } else if (error == null){
        text = error
      } else{
        text = "Unknown Error"
      }

      if (text == null){
        message.channel.send('That scp doesn\'t exist, use `help` for info on the command');
      } else{
        if(!title){
          title = 'Link -> SCP-' + num
        }
        var embed = {
          "title": title,
          "description": text,
          "url": link,
          "color": 5577355,
          "author": {
            "name": "Marv"
          }
        };
        message.channel.send({embed});
      }
    });
  }

  if(command == 'scp') {
    var num = args[0]
    if (num == 'random'){
      num = String(Math.floor(Math.random()*(4999-001+1)+001)).padStart(3,'0')
    }
    var link = 'http://www.scp-wiki.net/scp-' + num

    var scpnum = 'Link -> SCP-' + num

    fetchEntry(link, num, '')

  }

  else if (command == '001'){
    if (args[0] == null) {
      var links = "[Sheaf Of Papers](http://www.scp-wiki.net/jonathan-ball-s-proposal) \n \
      [The Prototype](http://www.scp-wiki.net/dr-gears-s-proposal) \n \
      [The Gate Guardian](http://www.scp-wiki.net/dr-clef-s-proposal) \n \
      [The Lock](http://www.scp-wiki.net/qntm-s-proposal) \n \
      [The Factory](http://www.scp-wiki.net/scp-001-o5) \n \
      [The Spiral Path](http://www.scp-wiki.net/dr-manns-proposal) \n \
      [The Legacy](http://www.scp-wiki.net/mackenzie-s-proposal) \n \
      [The Database](http://www.scp-wiki.net/sandrewswann-s-proposal) \n \
      [The Foundation](http://www.scp-wiki.net/scantron-s-proposal) \n \
      [Thirty-Six](http://www.scp-wiki.net/djoric-dmatix-proposal) \n \
      [Keter Duty](http://www.scp-wiki.net/roget-s-proposal) \n \
      [Ouroboros](http://www.scp-wiki.net/ouroboros) \n \
      [A Record](http://www.scp-wiki.net/kate-mctiriss-s-proposal) \n \
      [Past and Future](http://www.scp-wiki.net/kalinins-proposal) \n \
      [The Consensus](http://www.scp-wiki.net/wrong-proposal) \n \
      [When Day Breaks](http://www.scp-wiki.net/shaggydredlocks-proposal) \n \
      [Gods Blind Spot](http://www.scp-wiki.net/spikebrennan-s-proposal) \n \
      [Normalcy](http://www.scp-wiki.net/wjs-proposal) \n \
      [The World at Large](http://www.scp-wiki.net/billiths-proposal) \n \
      [Dead men](http://www.scp-wiki.net/tanhony-s-proposal) \n \
      [The Worlds gone Beautiful](http://www.scp-wiki.net/lily-s-proposal) \n \
      [The Scarlet King](http://www.scp-wiki.net/tuftos-proposal) \n \
      [A Simple Toymaker](http://www.scp-wiki.net/jim-north-s-proposal) \n \
      [Story of Your Life](http://www.scp-wiki.net/i-h-p-proposal) \n \
      [A Good Boy](http://www.scp-wiki.net/scp-001-ex) \n \
      [Project Palisade](http://www.scp-wiki.net/wmdd-s-proposal) \n \
      [O5-13](http://www.scp-wiki.net/captain-kirby-s-proposal) \n \
      [Fishhook](http://www.scp-wiki.net/pedantique-s-proposal)"

      var embed = {
        "title":"001 proposals",
        "description":links,
        "color":5577355,
        "author": {
          "name":"Marv"
        }
      };
      message.channel.send({embed});
    }
  }

  else if (command == 'help') {
    var embed = {
      "title":"Commands List",
      "description":"Usage is shown with each command",
      "color":5577355,
      "author":{
        "name":"Marv"
      },
      "fields":[{
        "name":"help",
        "value":"Displays this message."
      },
      {
        "name":"scp",
        "value":"Used as `scp x` where x is the scp number."
      },
      {
        "name":"tales",
        "value":"Used as `tales x` where x is the title. Supports partial titles ex: `%tales bearl-ly thought` will return `A Bear-ly Thought Out Plan`"
      },
      {
        "name":"001",
        "value":"Links all the 001 proposals"
      },
      {
        "name":"info",
        "value":"Displays information about the bot such as amount of users."
      },
      {
        "name":"ping",
        "value":"Returns the bots ping in ms."
      }]
    };
    message.channel.send({embed});
  }

  else if (command == 'ping') {
    const m = await message.channel.send('Ping?');
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
  }

  else if (command == 'info') {
    var embed = {
      "title":"Info",
      "author":{
        "name":"Marv"
      },
      "color": 5577355,
      "fields": [{
        "name":"Guilds",
        "value":bot.guilds.size
      },
      {
        "name":"Channels",
        "value":bot.channels.size
      },
      {
        "name":"Users",
        "value":bot.users.size
      },
      {
        "name":"Support server",
        "value":"https://discord.gg/NEXPCJz"
      }]
    };
    message.channel.send({embed});
  }

  else if (command == 'gregg_rulz'){
    message.channel.send('ok');
  }

  else if (command == 'tales'){
    var input = message.content.split('%tales')[1].trim()
    if(input && input.length >= 2){
      request('http://www.scp-wiki.net/tales-by-title', function(error,response,html){
        if (!error && response.statusCode == 200){
          var re = new RegExp(".*" + input + ".*", "gmi")
          const $ = cheerio.load(html);
          var hasEntry = false
          var entries = 0

          $( "#page-content td" ).each(function(i) {
            entries++
          });

          if(input != 'random'){
            $( "#page-content td" ).each(function(i) {
              var title = $(this).children('a').eq(0).text()
              if(re.test(title)){
                console.log('found a match! Title is: '+title+'\nAnd input is: '+input)
                var link = 'http://www.scp-wiki.net'+$(this).children('a').eq(0).attr('href')

                fetchEntry(link, false, title)
                hasEntry = true
                return false;
              }
            });
            if(!hasEntry){
              message.channel.send('That tale doesn\'t exist, use `help` for info on the command');
            }
          }else{
            var attempt = 0
            function fetchRandomTale(){
              var randNum = Math.floor(Math.random()*(entries-1+1)+1)
              $( "#page-content td" ).each(function(i) {
                var entry = $(this).children('a').eq(0)
                if(i == randNum){
                  var title = entry.text()
                  var link = 'http://www.scp-wiki.net'+entry.attr('href')
                  if(title && link){
                    fetchEntry(link, false, title)
                  }else{
                    console.log('not a valid entry, trying again!')
                    if(attempt < 5){
                      attempt++
                      fetchRandomTale()
                    }else{
                      message.channel.send('Couldn\'t fetch a random entry! PANIC! AHHH!!!');
                    }
                  }
                  return false;
                }
              });
            }
            fetchRandomTale()
          }
        };
      })
    }
  }

  else if (command == 'sysinfo'){
    function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

    si.mem(function(data) {
      var total_mem = formatBytes(data.total)
      var avail_mem = formatBytes(data.available)
      si.currentLoad(function(data){
        var cur_load = data.currentload
        var avg_load = data.avgload

        var embed = {
          "description": " \
            **Available Memory:** "+avail_mem+" \n \
            **Total Memory:** "+total_mem+" \n \n\
            **Average Load:** "+avg_load+" \n \
            **Current Load:** "+cur_load+" \n \
          ",
          "color": 5577355,
          "author": {
            "name": "Diag-Marv-stics"
          }
        };
        message.channel.send({embed});
      })
    })
  }

  else{
    message.channel.send('Thats not a valid command, use `help` to view commands.');
  }

});

bot.login(config.token);
