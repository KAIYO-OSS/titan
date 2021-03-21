//import {SERVICE_NAME} from "../constants";

var SERVICE_NAME = 'Odin';

const bunyan = require("bunyan");

const log = bunyan.createLogger({name: SERVICE_NAME});

module.exports = log;
