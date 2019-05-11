const { ShardingManager } = require('discord.js');
const mngr = new ShardingManager('./bot.js', process.env.DISCORD_TOKEN);

mngr.spawn();
mngr.on('launch', shard => console.log(`Started shard ${shard.id}`));
