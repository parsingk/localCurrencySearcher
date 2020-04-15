const mysql      = require('mysql');
const dbConfig = {
    host     : '34.64.153.190',
    port     : '3306',
    user     : 'root',
    password : '1q2w3e4r!!@@',
    database : 'localCurrency',
    connectionLimit : 50
    , socketPath: '/cloudsql/mask-270506:asia-northeast3:main-sql'
};
const pool = mysql.createPool(dbConfig);

module.exports = pool;