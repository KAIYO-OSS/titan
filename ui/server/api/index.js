const express = require('express');
const app = express.Router();
const odinApi = require("./odin");

app
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
        let token = req.headers.get("x-access-token"); // jwt({emailaddress:token:timestamp}) hs256
        logger.info({
            url: req.hostname,
            path: req.path,
            query: req.query,
            params: req.params,
            body: req.body,
            headers: req.headers,
        });
        // acl and authentication.
        next();
    })
    .use(express.json())
    .use("/odin-api", odinApi)

module.exports = app;
