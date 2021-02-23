const express = require('express');
const httpProxy = require('express-http-proxy');
const app = express();

const odinServiceProxy = httpProxy('https://odin.kaiyo.tech');

app.use((req, res, next) => {
    /*
        Authentication login -> preferably use a JWT token with no persistence
        required. Just use a timestamp for the token-liveliness

        Also, pack some user-claims data which will be required by the ACL module
        for role-based resource filtering

    */
    next()
})

// Main a list of odin endpoints

var odinGetDeploymentEndpoint = '/getDeployment/{deploymentId}'

app.get('/getDeployment/{deploymentId}', (req, res, next) => {
    odinServiceProxy(req, res, next)
})

