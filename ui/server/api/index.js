const express = require('express');
const app = express.Router();
const odinApi = require("./odin");
const acl = require("./../acl");
const logger = require('./../logger');
const jwt = require('jsonwebtoken');
const { response } = require('express');

app
    .use(express.json())
    // .use(async function (req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    //     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

    //     let logObj = {
    //         'path': 'api/index'
    //     }

    //     let accessToken = req.headers['x-access-token'];
    //     if(!accessToken) {
    //         logObj.note = 'No access token sent';
    //         logger.error(logObj);
    //         res.status(401);
    //         res.send({
    //             'msg': 'Access token is missing. Access Denied.'
    //         });
    //         return;
    //     }

    //     let claims = acl.decodeTokenForUserInfo(accessToken);

    //     if(!claims) {
    //         logObj.note = 'Claims for the access token is NULL';
    //         logger.error(logObj);
    //         res.status(401);
    //         res.send({
    //             'msg': 'No claims found for the user. Access Denied.'
    //         });
    //         return;
    //     }

    //     if(typeof claims === 'string') {
    //         claims = JSON.parse(claims);
    //     }

    //     if(Object.keys(claims).length === 0 && claims.constructor === Object) {
    //         res.status(401);
    //         res.send({
    //             'msg': 'Incorrect user credentials. Access Denied.'
    //         });
    //         return;
    //     }

    //     if(claims['status'] === 400) {
    //         res.status(401);
    //         res.send({
    //             'msg': 'The access token is not accepted. Access Denied.'
    //         });
    //         return;
    //     }

    //     let authResp = await acl.authenticateTheUser(claims);

    //     if(authResp['status'] === 500) {
    //         logObj.note = 'Error encountered for access token = '.concat(accessToken);
    //         logger.error(logObj);
    //         res.status(500);
    //         res.send({
    //             'msg': 'Something went wrong. Contact Tech Support.'
    //         })
    //         return;

    //     }else if(authResp['status'] === 401) {
    //         logObj.note = 'Access denied for token = '.concat(accessToken);
    //         logger.info(logObj);
    //         res.status(401);
    //         res.send({
    //             'msg': 'Incorrect user credentials.'
    //         })
    //         return;
    //     }        
    //     next();
    // })
    .use("/", odinApi)


module.exports = app;

