const etcdClient = require("./../db");
const globals = require("./../constants");
const jwt = require('jsonwebtoken');
const logger = require("./../logger");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const acl = require("./../acl");
const app = express();  

app
    .use(express.json())
    .use('/search', async function(req, res, next) {
        let secret = globals.APP_COMMON_SECRET;
        let k = req.body['k'];
        if((typeof req.headers['secret'] == 'undefined') || req.headers['secret'] != secret) {
            logger.info('Wrong secret key has been passed');
            res.status(403);
            res.send({
                'msg': 'Access denied'
            });
        }

        let v;
        try {
            v = await etcdClient.get(k);
            if(k.includes('acl:acl_token')) {
                v = JSON.parse(v);
            }
        }catch(e) {
            logger.info('DB error encountered in SEARCH function');
            res.status(500);
            res.send({
                'msg': 'Internal server error'
            });
        }

        res.status(200);
        res.send({
            'msg': v
        });
    })
    .use('/insert', async function(req, res, next) {
        /*
            This function will be used for inserting key-value
            pairs in the ETCD DB for testing various endpoints.
            In the headers, pass the 'secret' to make an
            authenticated request.
         */
        let secret = globals.APP_COMMON_SECRET; // This password should be passed int he headers
        if((typeof req.headers['secret'] == 'undefined') || req.headers['secret'] != secret) {
            logger.info('Wrong secret key has been passed');
            res.status(403);
            res.send({
                'msg': 'Access denied'
            });
        }

        let k = req.body['k'];
        let v = req.body['v'];

        if(k.includes('acl:acl_token')) {
            v = JSON.stringify(v);
        }

        try {
            let r = await etcdClient.put(k,v);
        }catch(e) {
            logger.info("DB error encountered in insert function");
            res.status(500);
            res.send({
                'msg': 'Internal server error'
            });
        }

        res.status(200);
        res.send({
            'msg': 'Data inserted successfully'
        });
    })
    .use('/login', async function(req, res, next) {

        let email = req.body['emailId'];
        let acl = req.body['acl'];
        let aclSearchKey = 'user:email_address-'.concat(email);
        let aclTokenInDB;

        try {
            aclTokenInDB = await etcdClient.get(aclSearchKey);
            console.log('The aclTokenInDB -> ', aclTokenInDB);
            if(typeof aclTokenInDB == 'undefined') {
                logger.info("No user found during login for aclSearchKey -> %s", aclSearchKey);
                res.status(403);
                res.send({
                    'msg': 'Access denied'
                })
            }
            if(acl != aclTokenInDB) {
                logger.info("Wrong acl token passed with aclSearchKey -> %s", aclSearchKey);
                res.status(403);
                res.send({
                    'msg': 'Access denied'
                })
            }
        }catch(e) {
            logger.info('DB error during login => ', e);
            res.status(500);
            res.send({'msg':'Internal Server Error'});
        }
        /* 
            Otherwise, the acl-key passed is matched with 
            the one stored in the DB, so, the user will be
            given access. Now, try to fetch the claims
            associated with the user so some data fields
            like 'role' and 'isActive' which are used
            frequently can be read with DB transactions.
        */

        let userInfoSearchKey = 'acl:acl_token-'.concat(aclTokenInDB);
        let userInfoForClaims;

        try {
            userInfoForClaims = await etcdClient.get(userInfoSearchKey);
            if(typeof userInfoForClaims == 'undefined') {
                logger.info('user data not found for userInfoSearchKey -> %s', userInfoSearchKey);
                res.status(404);
                res.send({'msg': 'User not found'});
            }
        }catch(e) {
            logger.info("DB error encountered in login while fetching user data", e);
            res.status(500);
            res.send({'msg': 'Internal Server Error'});
        }

        userInfoForClaims = JSON.parse(userInfoForClaims);

        let claimsToBeEncoded = {
            'email': email,
            'acl': acl,
            'isActive': userInfoForClaims['isActive'],
            'role': userInfoForClaims['role'],
            'timestamp': Math.floor(Date.now()/1000)
        };

        let sessToken = jwt.sign(claimsToBeEncoded, globals.JWT_SECRET,
            {algorithm: 'HS256'});

        res.setHeader('x-access-token', sessToken);
        res.status(200);
        res.send({
            'msg': 'Successfully logged in !'
        });
        
    })
    .use('/create', async function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

        let accessToken = req.headers['x-access-token'];
        let userValidate = acl.decodeTokenForUserInfo(accessToken);
        let rights = userValidate['data']['role'];
        let active = userValidate['data']['isActive'];
        let isRequestMakerAdmin = acl.isUserAdmin(rights);

        if(typeof isRequestMakerAdmin === 'undefined') {
            res.status(403);
            res.send({
                'msg': 'Could not verify user\'s access token'
            })
        }else if(isRequestMakerAdmin === Boolean(0)) {
            res.status(403);
            res.send({
                'msg': 'The user doesn\'t have access to users new user'
            })
        }else if(active === Boolean(0)) {
            res.status(403);
            res.send({
               'msg': 'The user is not active to make this request'
            });
        }

        let authResp = acl.authenticateTheUser(userValidate);

        if(authResp['status'] !== 200) {
            res.status(authResp['status']);
            res.send({
                'msg': authResp['msg']
            });
        }

        let emailId = req.body['emailId'];
        let userKey = 'user:email_address-'.concat(emailId);
        let userAcl = req.body['acl'];

        try {
            let d = etcdClient.put(userKey, userAcl);
        } catch (e) {
            logger.info("PUT function failed in users endpoint => ", e);
            res.status(500);
            res.send({
                'msg': 'Interval Server Error'
            })
        }

        let newAcl = req.body['acl'];
        let aclTokenFullKey = "acl:acl_token-".concat(newAcl);

        let userData = {
            'designation': req.body['designation'],
            'role': req.body['role'],
            'managers': req.body['managers'],
            'apiAccess': req.body['apiAccess'],
            'isActive': true,
            'name': req.body['name']
        }

        try {
            let x = etcdClient.put(aclTokenFullKey, JSON.stringify(userData));
            logger.info('New user Information inserted successfully');
        } catch (e) {
            logger.info('DB error encountered in createUser while adding userInfo => %s', e);
            res.status(500);
            res.send({
                'msg': 'Internal Server Error'
            })
        }

        res.status(200);
        res.send({
            'msg': 'User created successfully'
        });
    })
    .use('/deactivate', async function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

        /* -> If the acl-token in the req-headers has an admin flag signature.
           -> Also, check if the user making the request is active or not.
        */
        let accessToken = req.headers['x-access-token'];
        let reqMakerUserInfo = acl.decodeTokenForUserInfo(accessToken);
        let aclOfReqMaker = reqMakerUserInfo['acl'];

        let isRequestMakerAdmin = acl.isUserAdmin(aclOfReqMaker);

        if(typeof isRequestMakerAdmin === 'undefined') {
            res.status(403);
            res.send({
                'msg': 'Could not verify user\'s access token'
            })
        }

        if(isRequestMakerAdmin['msg'] === Boolean(0)) {
            res.status(403);
            res.send({
                'msg': 'The user doesn\'t have access to users new user'
            })
        }

        logger.info('The user with aclToken -> %s has user deactivation rights',
            aclOfReqMaker);

        let emailAddressForDeactivation = req.body['emailId'];

        let emailKeyPrefix = 'user:email_address-';
        let userKey = emailKeyPrefix.concat(emailAddressForDeactivation);
        let aclOfUserToBeDeactivated;

        try {
            aclOfUserToBeDeactivated = etcdClient.get(userKey);
            logger.info('The acl-token of user to be deactived -> %s', aclOfUserToBeDeactivated);
            if(typeof aclOfUserToBeDeactivated == 'undefined') {
                res.status(404);
                res.send({
                    'msg': 'The user to be deleted not found'
                })
            }
        }catch(e) {
            logger.info('DB error while fetching acl-token of user to be deactivated -> %s', e);
            res.status(500);
            res.send({
                'msg': 'Internal Server Error'
            })
        }
        
        let userDataByEmailPrefix = 'acl:acl_token-';
        let userDataSearchKey = userDataByEmailPrefix.concat(aclOfUserToBeDeactivated);
        let userInfo;

        try {
            userInfo = etcdClient.get(userDataSearchKey);    
            if(typeof userInfo == 'undefined') {
                logger.info('userInfo not found for deactivateUser against the key -> %s', userDataSearchKey);
                res.status(404);
                res.send({
                    'msg': 'User to be deleted not found'
                })
            }
        }catch(e) {
            logger.info('DB error encountered in deactiveUser -> ', e);
            res.status(500);
            res.send({
                'msg': 'Internal Server Error'
            })
        }

        userInfo['isActive'] = false;
        
        /*
            Now, use the put to reinsert the formatted userInfo back into the db
        */

        try {
            let ins = etcdClient.put(userDataSearchKey, userInfo);
        }catch(e) {
            logger.info('DB error encountered in deactivateUser while putting formatted' +
            'user data -> %s', e);
            res.status(500);
            res.send({
                'msg': 'Internal Server Error'
            })
        }

        logger.info('User successfully deactivated');
        res.status(200);
        res.send({
            'msg': 'User successfully deactivated'
        });

    });

module.exports = app;