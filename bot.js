#!/usr/bin/env node
const Discord = require('discord.js');
const config = require('./config.json');
const cheerio = require('cheerio');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const { createLogger, format, transports } = require('winston');
require('winston-mongodb');
const bot = new Discord.Client();

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

  if(command == 'scp') {
    var num = args[0]
    if (num == 'random'){
      num = String(Math.floor(Math.random()*(4999-001+1)+001)).padStart(3,'0')
    }
    var link = 'http://www.scp-wiki.net/scp-' + num
    var text = ''
		var scpnum = 'Link -> SCP-' + num

    request(link, function(error,response,html){
      if (!error && response.statusCode == 200){
        const $ = cheerio.load(html);
        $( "#page-content p" ).each(function(i) {
          if ((i == 5)||(i == 2 && num == '001')) {
            return false;
          }

          text = text+$(this).text()+'\n\n'

				});

				// are we longer than 2000 chars?
	  		if (text.length >= 2000) {
	    		// yup. Lets truncate to 1997 and add some fancy elipsis!
	    		text = text.substr(0, 1997)+'...'
	  		}

				logger.log({
  				level: 'info',
  				message: 'Fetching Entry!',
  				meta: {
    				type:'fetch',
    				guild_name: message.guild.name,
    				guild_id: message.guild.id,
						scp_num: num,
						text: text,
						error:error,
						status_code: response.statusCode,
    				date: new Date()
					}
				});

      } else if (error == null){
        text = error
      } else{
				text = "Unknown Error"
			}

			if (text == null){
				message.channel.send('That scp doesn\'t exist, use `help` for info on the command');

			} else{
				var embed = {
					"title": scpnum,
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

	else if (command == '001'){
		if (args[0] == null) {
			var embed = {
				"title":"001 proposals",
				"description":"[Sheaf Of Papers](http://www.scp-wiki.net/jonathan-ball-s-proposal) \n [The Prototype](http://www.scp-wiki.net/dr-gears-s-proposal) \n [The Gate Guardian](http://www.scp-wiki.net/dr-clef-s-proposal) \n [The Lock](http://www.scp-wiki.net/qntm-s-proposal) \n [The Factory](http://www.scp-wiki.net/scp-001-o5) \n [The Spiral Path](http://www.scp-wiki.net/dr-manns-proposal) \n [The Legacy](http://www.scp-wiki.net/mackenzie-s-proposal) \n [The Database](http://www.scp-wiki.net/sandrewswann-s-proposal) \n [The Foundation](http://www.scp-wiki.net/scantron-s-proposal) \n [Thirty-Six](http://www.scp-wiki.net/djoric-dmatix-proposal) \n [Keter Duty](http://www.scp-wiki.net/roget-s-proposal) \n [Ouroboros](http://www.scp-wiki.net/ouroboros) \n [A Record](http://www.scp-wiki.net/kate-mctiriss-s-proposal) \n [Past and Future](http://www.scp-wiki.net/kalinins-proposal) \n [The Consensus](http://www.scp-wiki.net/wrong-proposal) \n [When Day Breaks](http://www.scp-wiki.net/shaggydredlocks-proposal) \n [Gods Blind Spot](http://www.scp-wiki.net/spikebrennan-s-proposal) \n [Normalcy](http://www.scp-wiki.net/wjs-proposal) \n [The World at Large](http://www.scp-wiki.net/billiths-proposal) \n [Dead men](http://www.scp-wiki.net/tanhony-s-proposal) \n [The Worlds gone Beautiful](http://www.scp-wiki.net/lily-s-proposal) \n [The Scarlet King](http://www.scp-wiki.net/tuftos-proposal) \n [A Simple Toymaker](http://www.scp-wiki.net/jim-north-s-proposal) \n [Story of Your Life](http://www.scp-wiki.net/i-h-p-proposal) \n [A Good Boy](http://www.scp-wiki.net/scp-001-ex) \n [Project Palisade](http://www.scp-wiki.net/wmdd-s-proposal) \n [O5-13](http://www.scp-wiki.net/captain-kirby-s-proposal) \n [Fishhook](http://www.scp-wiki.net/pedantique-s-proposal)",
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
				}
			]
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
				}
			]
		};
		message.channel.send({embed});
	}

  else if (command == 'tunnel_snakes'){
    message.channel.send('RULE!!');
  }

  else{
    message.channel.send('Thats not a valid command, use `help` to view commands.');
  }

});

bot.login(config.token);
