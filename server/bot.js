const Discord = require('discord.js')
const bot = new Discord.Client()
const DBL = require('dblapi.js')
const dbl = new DBL(process.env.BOTLIST_TOKEN, bot)
const { RichEmbed } = require('discord.js')
const langCodes = ['en', 'ru', 'ko', 'cn', 'fr', 'pl', 'es', 'th', 'ja', 'de', 'it', 'ua', 'pt/br', 'cz']
const commands = require('./localisation/commands')

// Sets bots activity to display amount of servers
function activity () {
  bot.shard.fetchClientValues('guilds.size')
    .then(results => {
      bot.user.setActivity(`Serving ${results.reduce((prev, guildCount) => prev + guildCount, 0)} servers | %help`)
    })
    .catch(console.error)
}

// Commands will only run after this
bot.on('ready', () => {
  console.log(`Started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers`)
  activity()
  setInterval(() => {
    // lets get the total number of servers from our ShardManager
    bot.shard.fetchClientValues('guilds.size')
      .then(results => {
        dbl.postStats(results.reduce((prev, guildCount) => prev + guildCount, 0))
      })
      .catch(console.error)
  }, 1800000)

  // print shard info
  setInterval(function () {
    bot.user.setActivity(`On shard ${bot.shard.id + 1} of ${bot.shard.count}`)
    setTimeout(function () {
      activity()
    }, 5000)
  }, 60000)
})

// When a server is joined
bot.on('guildCreate', guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). With ${guild.membercount} members`)
  logGuild('Added to Guild!', guild, 'added')
  activity()
})

// When removed from a server
bot.on('guildDelete', guild => {
  console.log(`Removed from: ${guild.name} (id: ${guild.id})`)
  logGuild('Removed from Guild!', guild, 'removed')
  activity()
})

// When a message is sent
bot.on('message', async message => {
  // Prevents replies to other bots
  if (message.author.bot) return

  // Finds the prefix for the guild, or uses the default if no custom prefix is set
  var prefix = '%'
  var lang = 'en'
  if (settings.findOne({ _id: message.guild.id })) {
    prefix = settings.findOne({ _id: message.guild.id }).prefix

    /*if(settings.findOne({ _id: message.guild.id }).language) {
      lang = settings.findOne({ _id: message.guild.id }).language
    } else {
      settings.update({ _id: message.guild.id }, { $set: { language: 'en' } })
    }*/
  }

  // Replies to mentions with the servers prefix
  if (message.isMentioned(bot.user)) {
    message.channel.send(commands[lang].PREFIX_CHECK + prefix)
  }

  // Prevents replies to un-prefixed messages
  if (message.content.substring(0, prefix.length) != prefix) return

  var args = message.content.slice(prefix.length).trim().split(/ +/g)
  var command = args.shift().toLowerCase()


  switch (command) {
    case 'scp':

      var num = args[0]
      fetchSCP(num, lang, function (data) {
        message.channel.send(data)
      })
      break

    case commands[lang].TALES:

      var input = message.content.split(commands[lang].TALES)[1].trim()
      fetchTales(input, function (data) {
        message.channel.send(data)
      })
      break

    case '001':

      var proposals = fetchProposals(lang)
      message.channel.send(proposals)
      break

    case commands[lang].PREFIX:

      // Prevents certain users from changing the prefix in a server
      if (message.member.hasPermission('MANAGE_GUILD')) {
        var new_prefix = args[0]
        if (new_prefix.length >= 500) {
          new_prefix = new_prefix.substring(0, 500)
        }
        // do we already have a prefix?
        if (settings.findOne({ _id: message.guild.id })) {
          // lets update it
          settings.update({ _id: message.guild.id }, { $set: { prefix: new_prefix } })
        } else {
          // nop lets insert it
          settings.insert({ _id: message.guild.id, prefix: new_prefix })
        }
        message.channel.send(commands[lang].PREFIX_CHANGE + new_prefix)
      } else {
        message.channel.send(commands[lang].COMMAND_FAILED_NOT_MOD)
      }
      break

    case commands[lang].LANG:
      //Will remain disabled until translations are sufficiently done
      /**if (message.member.hasPermission('MANAGE_GUILD')) {
        var new_lang = args[0]
        if (langCodes.includes(new_lang)) {

          if (settings.findOne({ _id: message.guild.id })) {
            settings.update({ _id: message.guild.id }, { $set: { language: new_lang } })
          } else {
            settings.insert({ _id: message.guild.id, language: new_lang })
          }
          message.channel.send(commands[new_lang].LANG_CHANGE + new_lang)

        } else {
          var codes = langCodes.join(' ')
          message.channel.send(commands[lang].COMMAND_FAILED_INVALID_CODE + codes)
        }
      } else {
        message.channel.send(commands[lang].COMMAND_FAILED_NOT_MOD)
      }**/
      break

    case commands[lang].INFO:

      fetchStats(bot, function (data) {
        message.channel.send(data)
      })
      break

    case commands[lang].PING:

      // Finds ping by checking when the 'Ping?' message is sent against when the command message was sent
      var m = await message.channel.send('Ping?')
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`)
      break

    case commands[lang].HELP:

      var page = args[0]
      fetchHelp(page, lang, function (data) {
        message.channel.send(data)
      })
      break

    case 'sysinfo':

      fetchSysInfo(function (data) {
        message.channel.send(data)
      })
      break

    case commands[lang].GENERATE:

      var input = message.content.split(commands[lang].GENERATE)[1].trim()

      var embed = shortPreProcessing(message)
      var m = await message.channel.send(embed[1])

      if (embed[0] != 'fail') {
        generateShort(input, function (data) {
          m.delete()
          if (data) {
            message.channel.send('Hey <@' + embed[2] + '> Heres your story!')
            message.channel.send(data)
          } else {
            message.channel.send('Error: Must be a number ( up to 5 digits )')
          }
        })
      }
      break

    case commands[lang].PURGE:

      var amount = ''
      var type
      var user = message.mentions.users.first()
      var ment
      var userID

      if (message.member.hasPermission('MANAGE_GUILD')) {
        var types = ['image', 'img', 'bot']
        var user = message.mentions.users.first()
        var memb
        var amount
        var type

        // Check for amount of messages to delete, and the type, by searching through all stored args
        args.forEach(function (item, index, array) {
          if (isNaN(item) == false) {
            amount = Number(item)
          } else if (types.includes(item) == true) {
            type = item
          }
        })

        // If theres a user mention, check if theyre in the guild
        if (user) {
          memb = message.guild.member(user)
          if (!memb) {
            message.channel.send(commands[lang].USER_NOT_IN_SERVER)
          } else {
            userID = memb.id
          }
        }

        // Makes sure an amount is given and is less than or equal to 100
        if (amount && amount <= 100) {
          purge(amount, type, userID, message, function (msgs) {

            //Bulk delete only can be used on more than 1 message, if theres only 1, grab only that from the awkward list, and delete it
            if (msgs.size > 1) {
              message.channel.bulkDelete(msgs)
            } else if (msgs.size == 1) {
              var id = String(msgs.firstKey(1))
              message.channel.fetchMessage(id).then(m => m.delete())
            } else {
              message.channel.send(commands[lang].PURGE_NO_MESSAGES)
            }

          })
        } else {
          message.channel.send(commands[lang].COMMAND_FAILED_NO_AMOUNT)
        }

      } else {
        message.channel.send(commands[lang].COMMAND_FAILED_NOT_MOD)
      }
      break

    case commands[lang].KICK:

      if (message.member.hasPermission('MANAGE_GUILD')) {
        var user = message.mentions.users.first()
        var check = message.guild.member(user)
        // If no user is mentioned
        if (!user) {
          message.channel.send(commands[lang].COMMAND_FAILED_NO_USER_KICK)
        } else {
          // If the member they try to kick is higher ranking than them
          if (message.member.highestRole.comparePositionTo(check.highestRole) <= 0) {
            message.channel.send(commands[lang].COMMAND_FAILED_UNABLE_TO_KICK)
          } else {
            // Removes the mention then joins other args together for the reason
            args.shift()
            var reason = args.join(' ')
            kickMember(check, reason, function (data) {
              message.channel.send(data)
            })
          }
        }
      } else {
        message.channel.send(commands[lang].COMMAND_FAILED_NOT_MOD)
      }
      break

    case commands[lang].BAN:

      if (message.member.hasPermission('MANAGE_GUILD')) {
        var user = message.mentions.users.first()
        var check = message.guild.member(user)
        if (!user) {
          message.channel.send(commands[lang].COMMAND_FAILED_NO_USER_BAN)
        } else {
          if (message.member.highestRole.comparePositionTo(check.highestRole) <= 0) {
            message.channel.send(commands[lang].COMMAND_FAILED_UNABLE_TO_BAN)
          } else {
            args.shift()
            var reason = args.join(' ')
            banMember(check, reason, function (data) {
              message.channel.send(data)
            })
          }
        }
      } else {
        message.channel.send(commands[lang].COMMAND_FAILED_NOT_MOD)
      }
      break

    default:
      //message.channel.send('Thats not a valid command, use `help` to view commands.') <-- removed for being annoying
  }
})

// Restarts on a full disconnect, after attempting to re-login
bot.on('disconnected', function () {
  logDisconnect()
  const exec = require('child_process').exec
  exec('restart marv')
})

bot.on('error', function (error) {
  logError(error)
})

bot.login(process.env.DISCORD_TOKEN)
