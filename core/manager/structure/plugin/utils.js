
const moment = require("moment");

module.exports.parseMs = (milliseconds) => {
    if (typeof milliseconds !== "number") {
        throw new TypeError("Expected a number");
    }

    return {
		days:     Math.trunc(milliseconds / 86400000),
		hours:     Math.trunc(milliseconds / 3600000) % 24,
		minutes:     Math.trunc(milliseconds / 60000) % 60,
		seconds:      Math.trunc(milliseconds / 1000) % 60,
		milliseconds:        Math.trunc(milliseconds) % 1000,
    }
};

module.exports.msToTime = duration => {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    let days = Math.floor((duration / (1000 * 60 * 60 * 24)));

    let str = "";
    str += days > 0 ? `${days} day(s) ` : "";
    str += hours > 0 ? `${hours} hour(s) ` : "";
    str += minutes > 0 ? `${minutes} minute(s) ` : "";
    str += seconds > 0 ? `${seconds} second(s) ` : "";

    return str || "0 second";
}