const { I18n } = require("i18n");
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const { con } = require('./manager/database/mysql.js');
const { 
    Client, Collection,
    GatewayIntentBits,
    Partials
} = require('discord.js');
const path = require("path");

const kaizo = new Client({
    restTimeOffset: 0,
    disableMentions : ['everyone', 'here'],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember
    ],
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],
});

module.exports = kaizo;

// --------------------------Structure------------------------------ //

    // --------------- Collection --------------- //
    kaizo.commands_arr = [];
    kaizo.commands = new Collection();
    kaizo.slashcommands = new Collection();
    kaizo.aliases = new Collection();
    kaizo.events = new Collection();
	kaizo.cooldowns = new Collection();

    kaizo.voices = new Collection();
    kaizo.snipes = new Collection();

    // --------------- Configuration --------------- //
    kaizo.config = require('./manager/config/bot.js');
    kaizo.key = require('./manager/config/key.js');
    kaizo.setup = require('./manager/config/setup.js');

    kaizo.gif_emo = require('./manager/emoji/gif.js');
    kaizo.static_emo = require('./manager/emoji/static.js');

    // --------------- Structure --------------- //
    kaizo.func = require('./manager/structure/plugin/function.js');
    kaizo.utils = require('./manager/structure/plugin/utils.js');
    kaizo.logger = require('./manager/structure/plugin/logger.js');

    // kaizo.structure = require('./manager/structure/structure'); /// edit folder here

    // --------------- Other --------------- //
    kaizo.mysql = con;
    kaizo.wait = wait;
    kaizo.i18n = new I18n({
        locales: ['en', 'vn', 'fr', 'jp', 'kr', 'cn'],
        directory: path.join(__dirname, 'locales')
    });
    kaizo.setMaxListeners(0);
    kaizo.delay = ms => new Promise(res => setTimeout(res, ms));

    // --------------- Loading Handler --------------- //
    ["antiCrash", "eventHandler", "prefixHandler", "slashHandler"].forEach((handler) => {
        require(`./manager/handlers/${handler}`)(kaizo);
    });
    

    // --------------- Check Beta Version --------------- //
    kaizo.login(kaizo.config.bot.token);
