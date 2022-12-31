console.clear();

const { ShardingManager } = require('discord.js');
const { bot, settings } = require('./core/manager/config/bot.js');
const logger = require('./core/manager/structure/plugin/logger.js');

const manager = new ShardingManager('./core/kaizo.js', {
    token: bot.token,
    totalShards: settings.shared,
    mode: "process"
});

manager.spawn(manager.totalShards, 10000);
manager.on('shardCreate', async (shard) => {
    logger.load(`Launched shard #${shard.id + 1} !`)
});