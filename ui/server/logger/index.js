var SERVICE_NAME = require("../constants");

const bunyan = require("bunyan");

const log = bunyan.createLogger({name: SERVICE_NAME});

module.exports = log;
