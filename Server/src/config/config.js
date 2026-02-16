require('dotenv').config();

const config = {
    port: parseInt(process.env.PORT || '4000', 10),
    mongoURL: process.env.mongoURL || 'mongodb://localhost:27017/Chatapp',

   
};

module.exports = config;
