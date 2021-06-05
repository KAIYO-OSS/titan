const etcdClient = require("./../db");
const globals = require("./../constants");
const jwt = require('jsonwebtoken');
const logger = require("./../logger");

async function authenticateTheUser(claims) {
    let userEmailPrefix = "user:email_address-"
    let emailFromClaimsData = userEmailPrefix.concat(claims['data']['email']);

    let aclTokenAgainstEmail;

    try {
        let t = await etcdClient.get(emailFromClaimsData);
        aclTokenAgainstEmail = t;
        if(!aclTokenAgainstEmail || claims['data']['acl'] !== aclTokenAgainstEmail) {
            return {
                'status': 401,
                'msg': 'Wrong acl token. Access denied.'
            };
        }
    }catch(e) {
        return {
            'status': 500,
            'msg': 'Internal Server Error'
        }
    }

    return {
        'status': 200,
        'msg': 'True'
    };
}

async function getUserInfo(aclToken) {

    var aclKeywordPrefix = "acl:acl_token-";
    let userInfoSearchKey = aclKeywordPrefix.concat(aclToken);
    var userInfo;
    try {
        userInfo = await etcdClient.get(userInfoSearchKey);

        if(!userInfo) {
            return {
                'status': 404,
                'msg': 'No user information available'
            }
        }
    }catch(e) {
        return {
            'status': 500,
            'msg': 'Internal Server Error'
        }
    }

    return {
        'status': 200,
        'msg': userInfo
    };
}

/*
   We might not even need this function
   once I start packing all the claims
   inside the jwt-token passed.
   For that I'll be sending more values
   in the json will be jwt-encoded after
   successful login
*/

async function isUserAdmin(accessToken) {
    let userInfo, role;
    let adminCheck = new Boolean(0);

    if(role == 'ADMIN') {
        return Boolean(1);
    }
    return Boolean(0);
}

function encodeClaimsIntoToken(claims) {

    let secret = globals.JWT_SECRET;
    let encoded = null;

    logObj = {
        'path': 'acl/index/encodeClaimsIntoToken',
        'claims': claims
    }

    try {
        encoded = jwt.sign(claims, secret, {algorithm: "HS256"});
    }catch(e) {
        logObj.note = 'Error encoding the claims data';
        logger.error(logObj);
        return {
            'status': 500,
            'data': 'Internal Server Error'
        };
    }

    logObj.note = 'Encoded the claims data';
    logger.info(logObj);

    return {
        'status': 200,
        'data': encoded
    };
}

function decodeTokenForUserInfo(accessToken) {

    var secret = globals.JWT_SECRET;
    var decoded = null;

    logObj = {
        'path': 'acl/index/decodeTokenForUserInfo',
        'accessToken': accessToken
    }

    try {
        decoded = jwt.verify(accessToken, secret, {algorithm: "HS256"});
    }catch(e) {
        logObj.note = 'Error decoding the JWT';
        logger.error(logObj);
        return {
            'status': 400,
            'data': 'Bad Request'
        }
    }

    logObj.note = 'Decoded JWT';
    logger.info(logObj);

    return {
        'status': 200,
        'data': decoded
    };

}

module.exports =  {
    authenticateTheUser,
    decodeTokenForUserInfo,
    getUserInfo,
    isUserAdmin,
    encodeClaimsIntoToken
};


