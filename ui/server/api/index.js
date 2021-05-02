const express = require('express');
const app = express.Router();
const odinApi = require("./odin");
const acl = require("./../acl");
const logger = require('./../logger');
const jwt = require('jsonwebtoken');
const { response } = require('express');

app
    .use(express.json())
    .use(async function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

        logger.info({
            url: req.hostname,
            path: req.path,
            query: req.query,
            params: req.params,
            body: req.body,
            headers: req.headers,
        });

        let accessToken = req.headers['x-access-token'];
        let claims = acl.decodeTokenForUserInfo(accessToken);

        if(typeof claims === 'string') {
            claims = JSON.parse(claims);
        }

        if(Object.keys(claims).length === 0 && claims.constructor === Object) {
            res.status(403);
            res.send({
                'msg': 'Incorrect user credentials. Access Denied.'
            });
        }

        let authResp = await acl.authenticateTheUser(claims);

        logger.info('The authResp inside API Index => %d', authResp);

        if(authResp['status'] === 500) {
            res.status(500);
            res.send({
                'msg': 'Something went wrong. Contact Tech Support.'
            })
        }else if(authResp['status'] === 401) {
            res.status(401);
            res.send({
                'msg': 'Incorrect user credentials.'
            })
        }        
        next();
    })
    .use("/", odinApi)


module.exports = app;

