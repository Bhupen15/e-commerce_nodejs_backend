const mongoose = require('mongoose');

const DB_CONNECT = process.env.DB_CONNECT;

module.export = mongoose.connect(DB_CONNECT);