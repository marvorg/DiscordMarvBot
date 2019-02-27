const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

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

logGuild = function(what, guild){
  logger.log({
    level: 'info',
    message: what,
    meta: {
      type:'added',
      guild_name: guild.name,
      guild_id: guild.id,
      guild_member_count: guild.membercount,
      date: new Date()
    }
  });
}
