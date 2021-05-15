const express = require("express");
const axios = require("axios");
const app = express.Router();
const odinBaseUrl = 'http://5cf6f1c0ebf6.ngrok.io'
const logger = require('./../../logger');
const globals = require('./../../constants')

// Deploy a service
app.post('/odin/service', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.DEPLOY_SERVICE_ENPOINT;
    let logObj = {
        'path': globals.DEPLOY_SERVICE_ENPOINT,
        'method': 'POST',
        'headers': req.headers,
        'input': req.body
    }
    axios.post(apiUrl,
        JSON.stringify(req.body),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => {
            res.send(rep.data)
        }).catch(err => {
            logObj.note('Exception encounted = ', err.response);
            logger.error(logObj);
            res.send({
                'msg': err.response
            })
    })
});

// Delete a service with serviceId
app.delete('/odin/service/:serviceId', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.DELETE_SERVICE_ENDPOINT
                 + req.params.serviceId;
    let logObj = {
        'path': globals.DELETE_SERVICE_ENDPOINT + req.params.serviceId,
        'method': 'DELETE',
        'headers': req.headers,
        'input': req.params.serviceId
    }
    axios.delete(apiUrl,{
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
            res.send({
                'msg': rep.data
            })
        }).catch(err => {
            logObj.note('Exception encountered = ', e.message);
            logger.info(logObj);
            res.status(err.response.status);
            res.send({
                'msg': err.response.statusText
            })
    });

});

// Get a service
app.get('/odin/service/:serviceId', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.GET_SERVICE_ENDPOINT
                 + req.params.serviceId;
    let logObj = {
        'path': globals.GET_SERVICE_ENDPOINT + req.params.serviceId,
        'method': 'GET',
        'headers': req.headers,
        'input': req.params.serviceId
    }
    axios.put(apiUrl,{
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
        res.send({
            'msg': rep.data
        })
    }).catch(err => {
        logObj.note('Error encountered = ', err.response);
        logger.error(logObj);
        res.status(err.status);
        res.send({
            'msg': err.response.statusText
        })
    })
});

// Get all services
app.get('/odin/services', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.GET_ALL_SERVICES_ENDPOINT;
    let logObj = {
        'path': globals.GET_ALL_SERVICES_ENDPOINT,
        'method': 'GET',
        'headers': req.headers,
        'input': ''
    }
    axios.get(apiUrl, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
        res.send({
            'msg': rep.data
        })
    }).catch(err => {
        logObj.note('Error encountered = ', e.message);
        logger.info(logObj);
        res.status(err.status);
        res.send({
            'msg': err.response.statusText
        })
    })
});

// Update a service
app.put('/odin/service', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.UPDATE_SERVICE_ENDPOINT;
    let logObj = {
        'path': globals.UPDATE_SERVICE_ENDPOINT,
        'method': 'PUT',
        'headers': req.headers,
        'input': req.body
    }
    axios.put(apiUrl, JSON.stringify(req.body), {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
            res.send({
                'msg': rep.data
            });
       }).catch(err => {
            logObj.note('Error encountered = ', e.message);
            logger.error(logObj);
            res.status(err.status);
            res.send({
                'msg': err.response.statusText
            })
       })
});


app.get('/details/health', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.DETAILS_HEALTHCHECK_ENDPOINT;
    let logObj = {
        'path': '/details/health',
        'method': 'GET',
        'headers': req.headers,
        'input': ''
    }
    axios.get(apiUrl)
        .then(rep => {
            res.send({
                'msg': rep.data
            });
        }).catch(err => {
            logObj.note('Error encountered = ', e.message);
            logger.error(logObj);
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

module.exports = app;
/*
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

app.get('/details/services', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.ALL_SERVICES_IN_WORKSPACE_ENDPOINT;
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
*/

