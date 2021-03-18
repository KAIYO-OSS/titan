const express = require('express');
const jwt = require('jwt-simple');
const app = express.Router();
const odinApi = require("./odin");
const dbUrl = 'http://127.0.0.1:4600';
//etcd = new Etcd(dbUrl)


app
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
        //let token = req.headers.get("x-access-token"); // jwt({emailaddress:token:timestamp}) hs256
        /*
        logger.info({
            url: req.hostname,
            path: req.path,
            query: req.query,
            params: req.params,
            body: req.body,
            headers: req.headers,
        });
        *
        var accessToken = req.headers['x-access-token'];
        var claims = userInfoFromToken(accessToken);
        
        if(typeof claims === 'string') {
            claims = JSON.parse(claims);
        }
        
        if(Object.keys(claims).length === 0 && claims.constructor === Object) {
            return {
                'statusCode': 401,
                'msg': 'Unauthorized'
            };
        }
        */
        next();
    })
    .use(express.json())
    .use("/odin-api", odinApi)


function userInfoFromToken(accessToken) {
    var secret = 'hReArhLO1YD0eOtN';
    var decoded = jwt.decode(accessToken, secret);
    console.log(decoded);
    return decoded;
}

function authenticateTheUser(claims) {
    /*
    DB operation 
    1st type of data : <emailAddress>:email -> <Acl-Token>:acl,
    2nd type of data : <Acl-Token>:acl -> '['/getDeployment', '']:apiList'
    
    emailFromClaimsData = claims['emailAddress'];

    try {
        aclTokenAgainstEmail = etcd.get(emailFromClaimsData.concat(':email'), console.log);
    }catch(e) {
        console.log('ETCD error encountered');
        return {
            'statusCode': 500,
            'msg': 'Internal Server Error'
        }
    } 
    
    if(claims['aclToken'] !== aclTokenAgainstEmail) {
        return {
            'statusCode': 401,
            'msg': 'Unauthorized'
        }
    }
    */
    return {
        'statusCode': 200,
        'msg': 'Authentication Successful'
    }
}

function deploymentApprovals() {
    /*
    DB operation
    GET call 
    3rd type of data : <emailAddress>:approvalEmail: '['{odin-deployment-req-1}']'
    */
   return;
}

function errorLogging(error) {
    /*
    DB operation
    POST call
    4rd type of data: <requestId>:error: <some-trackback>
    */
    return;   
}

module.exports = app;

