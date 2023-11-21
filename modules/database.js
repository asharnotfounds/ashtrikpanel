const mysql2 = require('mysql2/promise');
const config = require(`../config.json`);

async function connectToDB() {
    return await mysql2.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
    });
}


module.exports.connectToDB = connectToDB
