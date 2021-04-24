var etcdClient = require("./../db");
var globals = require("./../constants");
const jwt = require('jsonwebtoken');
const logger = require("./../logger");

async function authenticateTheUser(claims) {
    var userEmailPrefix = "user:email_address-"
    let emailFromClaimsData = userEmailPrefix.concat(claims['data']['emailAddress']);
    console.log('emailFromClaimsData => %s', emailFromClaimsData);
    let aclTokenAgainstEmail = null;

    try {
        let tokenArray = await etcdClient.get(emailFromClaimsData);
        aclTokenAgainstEmail = tokenArray;
        logger.info("AclTokenAgainstEmail in authenticateUser => %s", aclTokenAgainstEmail);
        
        if(typeof aclTokenAgainstEmail == 'undefined' || claims['data']['aclToken'] !== aclTokenAgainstEmail) {
            return {
                'status': 401,
                'msg': 'Wrong authentication token'
            };
        }
    }catch(e) {
        logger.info('ETCD error in authenticateUser => %s', e);
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

        if(typeof userInfo == 'undefined') {
            return {
                'status': 404,
                'msg': 'No user information available'
            }
        }
    }catch(e) {
        logger.info("ETCD error in getUserInfo => %s", e);
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

async function isUserAdmin(aclToken) {
    var userInfo;
    var adminCheck = new Boolean(0);
    try {
        let userInfoResp = getUserInfo(aclToken);
        if(typeof userInfoResp == 'undefined') {
            return {
                'status': 404,
                'msg': 'No such user found'
            }
        }
        userInfo = userInfoResp['msg'];
    }catch(e) {
        logger.info("DB error encountered in isUserAdmin => %s", e);
        return {
            'status': 500,
            'msg': 'Internal Server Error'
        }
    }
    /* Check to find out if the user making the request is an admin */
    if(userInfo['role'] == 'ADMIN') {
        adminCheck = Boolean(1);
    }else {
        adminCheck = Boolean(0);
    }

    return {
        'status': 200,
        'msg': adminCheck
    }
}

function decodeTokenForUserInfo(accessToken) {

    var secret = globals.JWT_SECRET;
    var decoded = null;

    try {
        decoded = jwt.verify(accessToken, secret, {algorithm: "HS256"});
        logger.info('The decoded in the userInfoFromToken => %s', decoded);
    }catch(e) {
        if(e instanceof jwt.JsonWebTokenError) {
            return {
                'status': 401,
                'data': 'Invalid session'
            };
        }
        return {
            'status': 400,
            'data': 'Bad Request'
        }
    }

    return {
        'status': 200,
        'data': decoded
    };

}

module.exports =  {
    authenticateTheUser,
    decodeTokenForUserInfo,
    getUserInfo,
    isUserAdmin
};


