const {Pool} = require('pg');
module.exports = new Pool({
    user: 'test',
    host: 'localhost',
    database: 'BakaTest',
    password: 'test',
    port: 5432,
});