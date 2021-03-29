var jwt = require('jwt-simple');
var etcdClient = require("./../db");
var globals = require("./../constants");

function authenticateTheUser(claims) {

    let emailFromClaimsData = claims['emailAddress'];
    let aclTokenAgainstEmail = null;

    try {
        let tokenArray = etcdClient.get(emailFromClaimsData.concat(':email')).split(":");
        aclTokenAgainstEmail = tokenArray[0];
        console.log('The aclTokenAgainstEmail =>', aclTokenAgainstEmail);
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

    return {
        'statusCode': 200,
        'msg': 'Authentication Successful'
    }
}


function userInfoFromToken(accessToken) {
    let secret = globals.JWT_SECRET;
    let decoded = jwt.decode(accessToken, secret);
    console.log(decoded);
    return decoded;
}

module.exports =  {
    authenticateTheUser,
    userInfoFromToken
};


