const { Pool, Client } = require('pg');
const format = require('pg-format');
const config = require('./config').pg;
const pool = new Pool(config);

class Sql {
    constructor() {
        //this.getConnection().then((con) => {this.connection = con});
    }

    //getConnection = async () => await pool.connect();

    closeConnectionPool() {
        pool.end();
    }

    query = async (sql, params) => {
        const res = await pool.query(sql, params);
        //  console.log(res.rows);
        //  await pool.end();
        //this.connection.release();
        return res.rows;
    }
}


module.exports = {
    pool
}
