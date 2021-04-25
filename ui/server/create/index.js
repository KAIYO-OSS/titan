var etcdClient = require("./../db");
var globals = require("./../constants");
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
    .use("/create", async function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

        var accessToken = req.headers['x-access-token'];
        var userMakerAccessInfo = acl.decodeTokenForUserInfo(accessToken);
        var aclOfReqMaker = userMakerAccessInfo['acl'];

        /* 
            Handling the authorization of the user creator 
        */
        var isRequestMakerAdmin = acl.isUserAdmin(aclOfReqMaker);

        if(typeof isRequestMakerAdmin == 'undefined') {
            res.send({
                'status': 403,
                'msg': 'Could not verify user\'s access token'
            })
        }

        if(isRequestMakerAdmin['msg'] == Boolean(0)) {
            res.send({
                'status': 403,
                'msg': 'The user doesn\'t have access to create new user'
            })
        }

        /* 
            The user has the authority to create a user
        */

        /* 
        This part is for the email Address to acl-Token mapping
        */

        var userEmailPrefix = "user:email_address-"
        var emailId = req.body['emailId'];
        var userKey = userEmailPrefix.concat(emailId);
        
        try {
            var d = etcdClient.put(userKey, aclToken);
            console.log("The value of d in create =>", d);
        }catch(e) {
            logger.info("PUT function failed in create endpoint => ", e);
            res.send({
                'status': 500,
                'msg': 'Interval Server Error'
            })
        }

        var designation = req.body['designation'];
        var role = req.body['role']; // The role needs to be enum
        var managers = req.body['managers'];
        var apiAccess = req.body['apiAccess'];
        var name = req.body['name'];

        var aclTokenKeyPrefix = "acl:acl_token-"
        var aclTokenFullKey = aclTokenKeyPrefix.concat(aclToken);

        var userData = {
            'designation': designation,
            'role': role,
            'managers': managers,
            'apiAccess': apiAccess,
            'isActive': true,
            'name': name
        }

        /* This part is for the acl-token to user-info mapping */
        try {
            var x = etcdClient.put(aclTokenFullKey, userData);
            logger.info("New user Information inserted successfully ")
        }catch(e) {
            logger.info("DB error encountered in createUser while adding userInfo => %s", e);
            res.send({
                'status': 500,
                'msg': 'Internal Server Error'
            })
        }

        res.send({
            'status': 200,
            'msg': 'User created successfully'
        });
    })
    .use("/deactivate", async function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

        /* -> If the acl-token in the req-headers has an admin flag signature.
           -> Also, check if the user making the request is active or not.
        */
        var accessToken = req.headers['x-access-token'];
        var reqMakerUserInfo = acl.decodeTokenForUserInfo(accessToken);
        var aclOfReqMaker = userMakerAccessInfo['acl'];

        var isRequestMakerAdmin = acl.isUserAdmin(aclOfReqMaker);

        if(typeof isRequestMakerAdmin == 'undefined') {
            res.send({
                'status': 403,
                'msg': 'Could not verify user\'s access token'
            })
        }

        if(isRequestMakerAdmin['msg'] == Boolean(0)) {
            res.send({
                'status': 403,
                'msg': 'The user doesn\'t have access to create new user'
            })
        }

        logger.info("The user with aclToken -> %s has user deactivation rights", aclOfReqMaker);

        var emailAddressForDeactivation = req.body['emailId'];

        var emailKeyPrefix = "user:email_address-";
        var userKey = emailKeyPrefix.concat(emailAddressForDeactivation);
        var aclOfUserToBeDeactivated;

        try {
            aclOfUserToBeDeactivated = etcdClient.get(userKey);
            logger.info("The acl-token of user to be deactived -> %s", aclOfUserToBeDeactivated);
            if(typeof aclOfUserToBeDeactivated == 'undefined') {
                res.send({
                    'status': 404,
                    'msg': 'The user to be deleted not found'
                })
            }
        }catch(e) {
            logger.info("DB error while fetching acl-token of user to be deactivated -> %s", e);
            res.send({
                'status': 500,
                'msg': 'Internal Server Error'
            })
        }
        
        var userDataByEmailPrefix = "acl:acl_token-"
        var userDataSearchKey = userDataByEmailPrefix.concat(aclOfUserToBeDeactivated);
        var userInfo;

        try {
            userInfo = etcdClient.get(userDataSearchKey);    
            if(typeof userInfo == 'undefined') {
                logger.info("userInfo not found for deactivateUser against the key -> %s", userDataSearchKey);
                res.send({
                    'status': 404,
                    'msg': 'User to be deleted not found'
                })
            }
        }catch(e) {
            logger.info("user")
        }

    });

module.exports = app;