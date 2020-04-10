const mysql      = require('mysql');
const dbConfig = {
    host     : 'localhost',
    user     : 'root',
    password : '1q2w3e!!',
    database : 'localCurrency'
};
const pool = mysql.createPool(dbConfig);

module.exports = pool;