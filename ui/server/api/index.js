const express = require('express');
const app = express.Router();
const odinApi = require("./odin");
const acl = require("./../acl");
const logger = require('./../logger');
const jwt = require('jsonwebtoken');

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
    .user("/login", async function(req, res, next) {
        var email = req.body['emailId'];
        var acl = req.body['acl'];
        var aclSearchKey = "user:email_address-".concat(email);
        var aclTokenInDB; 

        try {
            aclTokenInDB = await odinApi.get(aclSearchKey);
            console.log("The aclTokenInDB -> %s", aclTokenInDB);
            if(typeof aclTokenInDB == 'undefined') {
                logger.info("No user found during login for aclSearchKey -> %s", aclSearchKey);
                res.send({
                    'status': 403,
                    'msg': 'Access denied'
                })
            }
            if(acl != aclTokenInDB) {
                logger.info("Wrong acl token passed with aclSearchKey -> %s", aclSearchKey);
                res.send({
                    'status': 403,
                    'msg': 'Access denied'
                })
            }
        }catch(e) {
            logger.info("DB error during login", e);
            res.send({'status': 500, 'msg': 'Internal Server Error'});
        }
        /* 
            Otherwise, the acl-key passed is matched with 
            the one stored in the DB, so, the user will be
            given access. Now, try to fetch the claims
            associated with the user so some data fields
            like 'role' and 'isActive' which are used
            frequently can be read with DB transactions.
        */

        var userInfoSearchKey = "acl:acl_token-".concat(aclTokenInDB);
        var userInfoForClaims;

        try {
            userInfoForClaims = await odinApi.get(userInfoSearchKey);
            if(typeof userInfoForClaims == 'undefined') {
                logger.info("user data not found for userInfoSearchKey -> %s", userInfoSearchKey);
                res.send({'status': 404, 'msg': 'User not found'});
                /*
                    The status to be returned in this case can
                    be discussed later but right now 'not found'
                    seems just appropriate
                */
            }
        }catch(e) {
            logger.info("DB error encountered in login while fetching user data", e);
            res.send({'status': 500, 'msg': 'Internal Server Error'});
        }

        var claimsToBeEncoded = {
            'email': email,
            'acl': acl,
            'isActive': userInfoForClaims['isActive'],
            'role': userInfoForClaims['role']
        };

        /* 
            Rest to be written
        */
        
    })
    .use("/", odinApi)


module.exports = app;

