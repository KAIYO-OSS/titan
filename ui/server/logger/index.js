const bunyan = require("bunyan");
const SERVICE_NAME = "ui-middleware";

const log = bunyan.createLogger({name: SERVICE_NAME});

module.exports = log;