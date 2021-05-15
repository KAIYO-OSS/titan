var SERVICE_NAME = require("../constants");

const bunyan = require("bunyan");

const log = bunyan.createLogger({name: 'Titan'});

module.exports = log;
