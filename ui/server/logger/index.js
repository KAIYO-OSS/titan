import {SERVICE_NAME} from "../constants";

const bunyan = require("bunyan");


const log = bunyan.createLogger({name: SERVICE_NAME});

module.exports = log;
