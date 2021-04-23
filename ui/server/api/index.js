const express = require('express');
const app = express.Router();
const odinApi = require("./odin");
const acl = require("./../acl");
const logger = require('./../logger');

app
    .use(async function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

        /*
        logger.info({
            url: req.hostname,
            path: req.path,
            query: req.query,
            params: req.params,
            body: req.body,
            headers: req.headers,
        });
        */

        var accessToken = req.headers['x-access-token'];
        console.log('The accessToken passed -> ', accessToken);
        var claims = acl.decodeTokenForUserInfo(accessToken);

        console.log('The claims acquired from the x-access-token passed =>');
        console.log(claims);

        if(typeof claims === 'string') {
            claims = JSON.parse(claims);
        }

        if(Object.keys(claims).length === 0 && claims.constructor === Object) {
            return {
                'statusCode': 401,
                'data': 'Incorrect user credentials.'
            };
        }

        authResp = await acl.authenticateTheUser(claims);

        logger.info('The authResp inside API Index => %d', authResp);

        if(authResp['status'] === 500) {
            res.send({
                'statusCode': 500,
                'data': 'Something went wrong. Contact Tech Support.'
            })
        }else if(authResp['status'] === 401) {
            res.send({
                'statusCode': 401,
                'data': 'Incorrect user credentials.'
            })
        }        
        next();
    })
    .use(express.json())
    .use("/", odinApi)


module.exports = app;

