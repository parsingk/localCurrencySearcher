const mysql      = require('mysql');
const dbConfig = {
    host     : '34.64.153.190',
    user     : 'root',
    password : '1q2w3e4r!!@@',
    database : 'localCurrency'
};
const pool = mysql.createPool(dbConfig);

module.exports = pool;