const mysql = require('mysql');
module.exports = {
	con:mysql.createConnection({
        host: 'remotemysql.com',
        user: 'h0seaP9c0S',
        password: '4wuGdqnoOb',
        database: 'h0seaP9c0S',
    })
};