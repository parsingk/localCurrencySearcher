const mysql      = require('mysql');
const dbConfig = {
    host     : '#',
    port     : '3306',
    user     : '#',
    password : '#',
    database : '#',
    connectionLimit : #
    , socketPath: '/cloudsql/mask-270506:asia-northeast3:main-sql'
};
const pool = mysql.createPool(dbConfig);

module.exports = pool;
