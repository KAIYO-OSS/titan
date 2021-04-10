var etcdClient = require("./../db");
var globals = require("./../constants");
const jwt = require('jsonwebtoken');

async function authenticateTheUser(claims) {
    let emailFromClaimsData = claims['data']['emailAddress'] + ":email";
    let aclTokenAgainstEmail = null;

    try {
        let tokenArray = await etcdClient.get(emailFromClaimsData);
        console.log(tokenArray)
        aclTokenAgainstEmail = tokenArray;
        console.log('The aclTokenAgainstEmail =>', aclTokenAgainstEmail);
    }catch(e) {
        console.log(e);
        console.log('ETCD error encountered');
        return 500;
    }

    if(claims['data']['aclToken'] !== aclTokenAgainstEmail.split(":")[0]) {
        return 401;
    }

    return 200;
}


function userInfoFromToken(accessToken) {

    var secret = globals.JWT_SECRET;
    var decoded = null;

    try {
        decoded = jwt.verify(accessToken, secret, {algorithm: "HS256"});
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
    userInfoFromToken
};


