const express = require('express');
const jwt = require('jwt-simple');
const app = express.Router();
const odinApi = require("./odin");
const acl = require("./../acl");

app
    .use(function (req, res, next) {
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
        var claims = acl.userInfoFromToken(accessToken);

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

        authResp = acl.authenticateTheUser(claims);

        if(authResp == 500) {
            return {
                'statusCode': 500,
                'data': 'Something went wrong. Contact Tech Support.'
            };
        }else if(authResp == 401) {
            return {
                'statusCode': 401,
                'data': 'Incorrect user credentials.'
            };
        }

        /* Calling next() if authResp -> 200 */
        console.log('Inside the api -> index.js')
        next();
    })
    .use(express.json())
    .use("/", odinApi)


module.exports = app;

