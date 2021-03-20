import * as etcdClient from "./../db";
import * as globals from "./../constants";

/* export for importing it from other files */
export function authenticateTheUser(claims) {

    emailFromClaimsData = claims['emailAddress'];

    try {
        aclTokenAgainstEmail = etcdClient.get(emailFromClaimsData.concat(':email'));
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


export function userInfoFromToken(accessToken) {
    var secret = globals.JWT_SECRET;
    var decoded = jwt.decode(accessToken, secret);
    console.log(decoded);
    return decoded;
}


