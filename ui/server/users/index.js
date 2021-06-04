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

async function createDefaultAdminUser() {
    let emailId = globals.ADMIN_EMAIL_ADDRESS;
    let aclToken = globals.ADMIN_ACL_TOKEN;

    let logObj = {
        'path': 'create-default-user',
        'emailId': emailId,
        'aclToken': aclToken
    }

    let userKey = 'user:email_address-'.concat(emailId);

    try {
        let d = etcdClient.put(userKey, aclToken);
    } catch (e) {
        logObj.note = 'DB error encountered => '.concat(e.message);
        logger.info(logObj);
    }

    let aclTokenFullKey = "acl:acl_token-".concat(aclToken);

    let userData = {
        'designation': 'Developer',
        'role': 'ADMIN',
        'managers': [],
        'apiAccess': [],
        'isActive': true,
        'name': 'Kaiyo-Admin'
    }

    try {
        let x = etcdClient.put(aclTokenFullKey, JSON.stringify(userData));
    } catch (e) {
        logObj.note = 'DB error encountered = '.concat(e.message);
        logger.error(logObj);
    }

    logObj.note = 'Default ADMIN user created';
    logger.info(logObj);

    return;
}
app
    .use(express.json())
    .use('/search', async function(req, res, next) {
        let secret = globals.APP_COMMON_SECRET;
        let k = req.body['k'];
        if(!req.headers['secret'] || (req.headers['secret'] != secret)) {
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
        if(!req.headers['secret'] || (req.headers['secret'] != secret)) {
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
        let logObj = {
            'path': '/login',
            'method': 'POST',
            'input': req.body
        }
        if(!req.body || !email || !acl) {
            //logObj.note = 'Null payload/keys passed';
            //logObj.info(logObj);
            res.status(401);
            res.send({
                'msg': 'Access denied'
            })
        }
        logObj.note = 'Beginning login process';
        logger.info(logObj);
        try {
            aclTokenInDB = await etcdClient.get(aclSearchKey);
            if(!aclTokenInDB) {
                logObj.note = 'ACL token not found in DB';
                logger.info(logObj);
                res.status(401);
                res.send({
                    'msg': 'Access denied'
                })
            }
            if(acl != aclTokenInDB) {
                logObj.note = 'ACL token in DB didn\'t match with the ACL passed';
                logger.info(logObj);
                res.status(401);
                res.send({
                    'msg': 'Access denied'
                })
            }
        }catch(e) {
            logObj.note('Error encountered => %s', e.message);
            logger.error(logObj);
            res.status(500);
            res.send({'msg':'Internal Server Error'});
        }

        logObj.note = 'Acl Token in DB matched with the one passed';
        logger.info(logObj);

        let userInfoSearchKey = 'acl:acl_token-'.concat(aclTokenInDB);
        let userInfoForClaims;

        try {
            userInfoForClaims = await etcdClient.get(userInfoSearchKey);
            if(!userInfoForClaims) {
                logObj.note = 'User data not found for userInfoSearchKey = '
                    .concat(userInfoSearchKey);
                logger.info(logObj);
                res.status(200);
                res.send({
                    'msg': 'User not found'
                });
            }
        }catch(e) {
            logObj.note = 'DB error encountered'
            logger.error(logObj);
            res.status(500);
            res.send({'msg': 'Internal Server Error'});
        }
        console.log(userInfoForClaims)
        userInfoForClaims = JSON.parse(userInfoForClaims);
        logObj.note = 'Claims for the user = '.concat(JSON.stringify(userInfoForClaims));
        logger.info(logObj);

        let claimsToBeEncoded = {
            'email': email,
            'acl': acl,
            'isActive': userInfoForClaims['isActive'],
            'role': userInfoForClaims['role'],
            'timestamp': Math.floor(Date.now()/1000)
        };

        let sessToken = jwt.sign(claimsToBeEncoded, globals.JWT_SECRET,
            {algorithm: 'HS256'});

        logObj.note = 'Login successful';
        logger.info(logObj);

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
        let logObj = {
            'path': '/create',
            'input': req.body
        }

        if(!isRequestMakerAdmin) {
            logObj.note = 'Admin rights unfulfilled';
            logger.info(logObj);
            res.status(403);
            res.send({
                'msg': 'Could not verify user\'s access token'
            })
        }else if(isRequestMakerAdmin === Boolean(0)) {
            logObj.note = 'Admin right unfulfilled';
            logger.info(logObj);
            res.status(403);
            res.send({
                'msg': 'The user doesn\'t have access to users new user'
            })
        }else if(active === Boolean(0)) {
            logObj.note = 'User is inactive.';
            logger.info(logObj);
            res.status(403);
            res.send({
               'msg': 'The user is not active to make this request'
            });
        }

        let authResp = acl.authenticateTheUser(userValidate);

        logObj.note = 'The value of authResp = '.concat(JSON.stringify(authResp));
        logger.info(logObj);

        if(authResp['status'] !== 200) {
            logObj.note = 'Failure response received from Auth';
            logger.info(logObj);
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
            logObj.note = 'DB error encountered => '.concat(e.message);
            logger.info(logObj);
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
            logObj.note = 'User claims written successfully';
            logger.info(logObj);
        } catch (e) {
            logObj.note = 'DB error encountered = '.concat(e.message);
            logger.error(logObj);
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

        let logObj = {
            'path': '/deactivate',
            'input': req.body
        }

        let accessToken = req.headers['x-access-token'];
        let reqMakerUserInfo = acl.decodeTokenForUserInfo(accessToken);
        let aclOfReqMaker = reqMakerUserInfo['acl'];

        let isRequestMakerAdmin = acl.isUserAdmin(aclOfReqMaker);

        if(!isRequestMakerAdmin) {
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
            if(!userInfo) {
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
module.exports.createDefaultAdminUser = createDefaultAdminUser;
