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
    .use(async function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

        console.log(req.body);

        var userEmailPrefix = "user:email_address-"
        var emailId = req.body['emailId'];
        var userKey = userEmailPrefix.concat(emailId);
        var aclToken = req.body['acl'];
        
        try {
            var d = etcdClient.put(userKey, aclToken);
            console.log("The value of d in create =>", d);
        }catch(e) {
            logger.info("PUT function failed in create endpoint => ", e);
        }
        
        res.send({});
    })


module.exports = app;