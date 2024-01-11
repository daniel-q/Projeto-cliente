require('dotenv').config();

module.exports = {
    dialect:process.env.DIALECT,
    host: process.env.HOST,
    username: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    define: {
        timestamps: true,
        
    },
};
