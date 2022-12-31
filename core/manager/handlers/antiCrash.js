
module.exports = async (kaizo) => {
	process.on('unhandledRejection', err => {
        return console.log(err);
    });
    process.on('warning', (warning) => {
        return console.log(warning.stack);
    });
};