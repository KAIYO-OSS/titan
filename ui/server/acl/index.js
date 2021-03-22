var etcdClient = require("./../db");
var globals = require("./../constants");

function authenticateTheUser(claims) {

    emailFromClaimsData = claims['emailAddress'];
    var aclTokenAgainstEmail = null;

    try {
        tokenArray = etcdClient.get(emailFromClaimsData.concat(':email')).split(":");
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
    var secret = globals.JWT_SECRET;
    var decoded = jwt.decode(accessToken, secret);
    console.log(decoded);
    return decoded;
}

module.exports =  {
    authenticateTheUser,
    userInfoFromToken
};


