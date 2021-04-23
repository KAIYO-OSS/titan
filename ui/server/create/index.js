var etcdClient = require("./../db");
var globals = require("./../constants");
const jwt = require('jsonwebtoken');
const logger = require("./../logger");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();  

app
    .use(express.json())
    .use("/create", async function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

        var userEmailPrefix = "user:email_address-"
        var emailId = req.body['emailId'];
        var userKey = userEmailPrefix.concat(emailId);
        var aclToken = req.body['acl'];

        /* 
        This part is for the email Address to acl-Token mapping
        */
        
        try {
            var d = etcdClient.put(userKey, aclToken);
            console.log("The value of d in create =>", d);
        }catch(e) {
            logger.info("PUT function failed in create endpoint => ", e);
        }

        var designation = req.body['designation'];
        var role = req.body['role'];
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
        }catch(e) {
            logger.info("DB error encountered in createUser while adding userInfo => %s", e);
        }

        res.send({});
    })
    .use("/deactivate", async function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

        /* if the acl-token in the req-headers has an admin flag signature */
        
        
    });

module.exports = app;