
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);

module.exports = async (kaizo) => {
    try {
        let prefixDir = await readdir("./commands/prefix/");
        prefixDir.forEach(dir => {
            const prefixFile = fs.readdirSync('./commands/prefix/' + dir + "/").filter(file => file.endsWith('.js'));
        
            for (const file of prefixFile) {
                const cmd = require(`${process.cwd()}/commands/prefix/${dir}/${file}`);

                if (!cmd.name) {
                    return kaizo.logger.error(`An unexpected error occured with PREFIX COMMANDS ${file}.`);
                }

                kaizo.commands.set(cmd.name, cmd);

                if (cmd.aliases && Array.isArray(cmd.aliases)) cmd.aliases.forEach((alias) => kaizo.aliases.set(alias, cmd.name));
            }
            
        })

        await kaizo.logger.ready(`Launched Prefix Commands !`);
    } catch (err) {
        kaizo.logger.error(err);
    }
};