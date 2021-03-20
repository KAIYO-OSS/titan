const express = require('express');
const jwt = require('jwt-simple');
const app = express.Router();
const odinApi = require("./odin");
import * as acl from "./../acl";

app
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
        //let token = req.headers.get("x-access-token"); // jwt({emailaddress:token:timestamp}) hs256
        logger.info({
            url: req.hostname,
            path: req.path,
            query: req.query,
            params: req.params,
            body: req.body,
            headers: req.headers,
        });

        var accessToken = req.headers['x-access-token'];
        var claims = acl.userInfoFromToken(accessToken);

        if(typeof claims === 'string') {
            claims = JSON.parse(claims);
        }

        if(Object.keys(claims).length === 0 && claims.constructor === Object) {
            return {
                'statusCode': 401,
                'msg': 'Unauthorized'
            };
        }

        next();
    })
    .use(express.json())
    .use("/odin", odinApi)


module.exports = app;

