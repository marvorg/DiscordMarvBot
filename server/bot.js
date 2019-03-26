// Edited the login
// Commented out DBL stats
//took setInterval for dbl out of bot.on('ready')

//
const prefix = '%'
const colors = require('colors/safe')
const fs = require('fs')
// added teh modules I added sperately, so you can move if pleased - lamb

const Discord = require('discord.js');
const bot = new Discord.Client();
const DBL = require("dblapi.js");
//const dbl = new DBL(process.env.BOTLIST_TOKEN, bot);
const { RichEmbed } = require('discord.js');

// Sets bots activity to display amount of servers
function activity(){
  bot.user.setActivity(`Serving ${bot.guilds.size} servers | %help`)
}

// Commands will only run after this
bot.on('ready', () => {
  console.log(`Started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers`);
  activity();
});


/*
setInterval(() => {
  dbl.postStats(bot.guilds.size);
}, 1800000);
*/


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

bot.on('message', message => {
  if(message.author.bot) return;
  var prefix = '%'
  if(settings.findOne({_id:message.guild.id})) prefix = settings.findOne({_id:message.guild.id}) //no need for else statements~

	if (message.content[0] === prefix) {

    bot.commands = new Discord.Collection();
    
		const dir1pre = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));
		const dir1 = dir1pre.map(function(v) {
			return '/fun/' + v;
    });

		const dir2pre = fs.readdirSync('./commands/scp').filter(file => file.endsWith('.js'));
		const dir2 = dir2pre.map(function(v) {
			return '/scp/' + v;
    });

		const dir3pre = fs.readdirSync('./commands/staff').filter(file => file.endsWith('.js'));
		const dir3 = dir3pre.map(function(v) {
			return '/staff/' + v;
    });

		const dir4pre = fs.readdirSync('./commands/utility').filter(file => file.endsWith('.js'));
		const dir4 = dir4pre.map(function(v) {
			return '/utility/' + v;
    });

    
		const commandFiles = dir1.concat(dir2, dir3, dir4)

    for (const file of commandFiles) {
      const command = require(`./commands${file}`);
      bot.commands.set(command.name, command);
    }
    // The above code scans the directories, mapping all of the commands it finds into a collection. 

    // Args is just the message string split by space, useful for multiple paramaters in code. args[0] being first word, args[1] being second, and so in.
    const args = message.content.substring(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
		if (!bot.commands.has(command)) return;

    // Tries to execute the selected file from the collection it loaded, catching it if it errors out.
		try {
			bot.commands.get(command).execute(bot, message, args);
		} catch (error) {
			console.error(colors.red(error));
			message.channel.send('there was an error trying to execute that command! Was it formatted correctly?');
		}
	}
}
);

// Restarts on a full disconnect
bot.on('disconnected', function() {
  logDisconnect()
  const exec = require("child_process").exec
  exec("restart marv")
});

bot.on('error', function(error){
  logError(error)
});

bot.login('NTQ1MDYxMjQ3NzQyMTE1ODQz.D3rs1Q.cmyCMviidpNLvXbaWwN-_LufRDI')