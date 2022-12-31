const MySQLCase = require('mysql');
const { mysql } = require('../config/data.js');

const config = {
    host: mysql.hostname,
    user: mysql.username,
    password: mysql.password,
    database: mysql.database,
    supportBigNumbers: mysql.supportBigNumbers,
    bigNumberStrings: mysql.bigNumberStrings,
    multipleStatements: mysql.multipleStatements,
    charset: mysql.charset,
    connectionLimit: mysql.limitConnect
}

const pool = MySQLCase.createPool(config)
exports.con = pool;
exports.mysql = mysql;