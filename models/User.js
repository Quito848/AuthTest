const Sequelize = require('sequelize');
const db = require('..\\config\\database');
const passportLocalPostgres = require('passport-local-postgres');

const User = db.define('user',{
    name:{
        type: Sequelize.STRING
    },
    password:{
        type: Sequelize.STRING
    }
});



module.exports = User;