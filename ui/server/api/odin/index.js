const express = require("express");
const axios = require("axios");
const app = express.Router();
const odinBaseUrl = 'http://5cf6f1c0ebf6.ngrok.io'
const logger = require('./../../logger');
const globals = require('./../../constants')


app.post('/odin/deploy/workspace/', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.DEPLOY_WORKSPACE_ENDPOINT;
    logger.info('Calling URL => ', apiUrl, ' with req => ', JSON.stringify(req.body));
    axios.post(apiUrl, {
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type': 'application/json'
        }
        }).then(rep => {
            res.send(rep.data)
        }).catch(err => {
            logger.info('Exception caught while calling => ',
                        globals.DEPLOY_WORKSPACE_ENDPOINT,
                        ' with req => ', JSON.stringify(req.body));
            // res.status(err.response.status)
            res.send({
                'msg': err.response
            })
    })
});

app.delete('/odin/remove/workspace/:workspaceId', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.DELETE_WORKSPACE_ENDPOINT +
        req.params.workspaceId;
    logger.info("URL called => %s", apiUrl, " with workspaceId => %s",
        req.params.workspaceId);
    axios.delete(apiUrl)
        .then(rep => {
            res.send({
                'msg': rep.data
            })
        }).catch(err => {
            logger.info("Exception caught while calling API => %s",
                globals.DELETE_WORKSPACE_ENDPOINT, " with workspaceId => ",
                req.params.workspaceId);
            res.status(err.response.status);
            res.send({
                'msg': err.response.statusText
            })
    });

});

app.post('/odin/service/deploy', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.DEPLOY_SERVICE_ENPOINT;
    logger.info('Odin Deploy Service API called =>', apiUrl, "with req => ",
        JSON.stringify(req.body));
    axios.post(apiUrl,  JSON.stringify(req.body),{
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
            res.send({
                'msg': rep.data
            })
        }).catch(err => {
            logger.info('Exception caught while calling API => ',
                globals.DEPLOY_SERVICE_ENPOINT, ' with REQ => ',
                JSON.stringify(req.body));
            res.status(err.response.status);
            res.send({
                'msg': err.response.statusText
            })
    })
});

app.post('/odin/update/service', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.UPDATE_SERVICE_ENDPOINT;
    logger.info('Url called => ', apiUrl, ' with REQ => ', JSON.stringify(req.body));
    axios.post(apiUrl, JSON.stringify(req.body),{
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
            res.send({
                'msg': rep.data
            });
       }).catch(err => {
            logger.info('Exception caught while calling => ',
            globals.UPDATE_SERVICE_ENDPOINT, " with REQ => ",
            JSON.stringify(req.body));
            res.status(err.status);
            res.send({
                'msg': err.response.statusText
            })
       })
});

app.delete('/odin/remove/service/:deploymentId', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.DELETE_SERVICE_ENDPOINT +
        req.params.deploymentId;
    logger.info('Url called => ' , apiUrl, ' with deploymentId => ',
        req.params.deploymentId);
    axios.delete(apiUrl)
        .then(rep => {
            res.send({
                'msg': rep.data
            });
        }).catch(err => {
            logger.info('Exception caught while calling => ',
                globals.DELETE_SERVICE_ENDPOINT, " with deploymentId => ",
                req.params.deploymentId);
            res.status(err.response.status);
            res.send({
                'msg': err.response.statusText
            })
        })
});

app.get('/details/health', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.DETAILS_HEALTHCHECK_ENDPOINT;
    logger.info('Url called =>', apiUrl);
    axios.get(apiUrl)
        .then(rep => {
            res.send({
                'msg': rep.data
            });
        }).catch(err => {
            logger.info('Exception caught while calling => ',
                        globals.DETAILS_HEALTHCHECK_ENDPOINT);
            res.status(err.response.status);
            res.send({
                'msg': err.response.statusText
            });
    })
})

app.get('/health', (req, res, next) => {
    res.send({
        'msg': 'Titan is up !'
    });
});

app.get('/details/workspace/info/:workspaceId', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.WORKSPACE_INFORMATION_ENDPOINT
                 + req.params.workspaceId;
    logger.info('Url called => ', apiUrl, ' with workspaceId => ',
                 req.params.workspaceId);
    axios.get(apiUrl)
        .then(rep => {
            res.send({
                'msg': rep.data
            })
        }).catch(err => {
            logger.info('Exception caught while calling => ',
                        globals.WORKSPACE_INFORMATION_ENDPOINT,
                        ' with workspaceId => ', req.params.workspaceId);
            res.status(err.response.status);
            res.send({
                'msg': err.response.statusText
            });
        })
});

app.get('/details/workspaces/:userId', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.ALL_WORKSPACES_ENDPOINT
                 + req.params.workspaceId;
    logger.info('Url called => ', apiUrl, ' with userId => ', req.params.userId);
    axios.get(apiUrl)
        .then(rep => {
            res.send({
                'msg': rep.data
            })
        }).catch(err => {
            logger.info('Exception caught while calling => ',
                        globals.ALL_WORKSPACES_ENDPOINT, ' with userId => ',
                        req.params.userId);
            res.status(err.response.status);
            res.send({
                'msg': err.response.statusText
            })
        })
});

app.get('/details/services/:workspaceId', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.ALL_SERVICES_IN_WORKSPACE_ENDPOINT
                + req.params.workspaceId;
    logger.info('Url called => ', apiUrl, ' with workspaceId =>', req.params.workspaceId);
    axios.get(apiUrl)
         .then(rep => {
            res.send({
                'msg': rep.data
            })
         })
         .catch(err => {
            logger.info('Exception caught while calling => ',
                        globals.ALL_SERVICES_IN_WORKSPACE_ENDPOINT,
                        ' with workspaceId => ', req.params.workspaceId);
            res.status(err.response.status);
            res.send({
                'msg': err.response.statusText
            });
        });
});

/*
    PENDING CHANGES FROM THIS POINT
 */
app.get('/details/deployments/:userId', (req, res, next) => {
    console.log('All user deployments called for userId => ' + req.params.userId);
    axios.get(odinBaseUrl + allUserDeployment + req.params.userId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
});

app.get('/details/service/info/:deploymentId', (req, res, next) => {
    console.log('Service information called for deploymentId => ' + req.params.deploymentId);
    axios.get(odinBaseUrl + serviceInformation + req.params.deploymentId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
});

app.get('/details/service/configuration/:deploymentId', (req, res, next) => {
    console.log('Current configuration called for deploymentId => ' + req.params.deploymentId);
    axios.get(odinBaseUrl + currentConfiguration + req.params.deploymentId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
});

app.get('/details/service/configurationall', (req, res, next) => {
    console.log('All configurations called');
    axios.get(odinBaseUrl + currentConfiguration)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
});


app.get('/polling/deploy/workspace/:workspaceId', (req, res, next) => {
    console.log('Polling users workspace called for workspaceId => ' + req.params.workspaceId);
    axios.get(odinBaseUrl + pollingCreateWorkspace + req.params.workspaceId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
});

app.get('/polling/remove/workspace/:workspaceId', (req, res, next) => {
    console.log('Polling delete workspace called for workspaceId =>' + req.params.workspaceId);
    axios.get(odinBaseUrl + pollingDeleteWorkspace + req.params.workspaceId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
});

app.get('/polling/deploy/service/:deploymentId', (req, res, next) => {
    console.log('Polling deploy service called for deploymentId => ' + req.params.deploymentId);
    axios.get(odinBaseUrl + pollingDeployService + req.params.deploymentId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
});

app.get('/polling/update/service/:deploymentId', (req, res, next) => {
    console.log('Polling update service called for deploymentId =>' + req.params.workspaceId);
    axios.get(odinBaseUrl + pollingUpdateService + req.params.workspaceId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
});

module.exports = app;

