const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

logger = createLogger({
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.MongoDB({
      db: process.env.MONGO_URL,
      capped: true,
      collection: 'winstonLogs',
      handleExceptions: true,
      storeHost: false,
    })
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logGuild = function(what, guild, type){
  logger.log({
    level: 'info',
    message: what,
    meta: {
      type: type,
      guild_name: guild.name,
      guild_id: guild.id,
      guild_member_count: guild.membercount,
      date: new Date()
    }
  });
}

logDisconnect = function(){
  logger.log({
    level: 'warn',
    message: 'Discord Bot Restarted',
    meta: {
      type: 'restart',
      date: new Date()
    }
  });
}

logRatelimit = function(message){
  logger.log({
    level: 'warn',
    message: 'A server reached the rate-limit!',
    meta: {
      server_name: message.guild.name,
      server_id: message.guild.id,
      type: 'rateLimit',
      date: new Date()
    }
  });
}

logError = function(error){
  logger.log({
    level: 'warn',
    message: 'The bot encountered an error!',
    meta: {
      error: error,
      type: 'error',
      date: new Date()
    }
  });
}
