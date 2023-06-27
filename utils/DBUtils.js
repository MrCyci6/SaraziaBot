const mariadb = require("mariadb");
require('dotenv').config();

const db = mariadb.createPool({
    host     : process.env.SQL_HOST,
    port     : process.env.SQL_PORT,
    user     : process.env.SQL_USER,
    password : process.env.SQL_PASSWORD,
    database : process.env.SQL_DATABASE,
    connectionLimit: 5
});

async function query(request) {
    db.getConnection()
    .then(conn => {
        conn.query(request)
            .then(rows => {
                conn.release();
            })
            .catch(err => {
                console.log(err);
                conn.release();
            });
    })
    .catch(err => {
        console.log(err);
    });
}

module.exports = {
    db,
    query
}