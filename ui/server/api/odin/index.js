const express = require("express");
const axios = require("axios");
const app = express.Router();
const logger = require('./../../logger');

let endpoints = {
    ODIN_SERVICE_URL: process.env.ODIN_SERVICE_URL || 'http://odin',
    DEPLOY_WORKSPACE_ENDPOINT: '/odin/deploy/workspace',
    DELETE_WORKSPACE_ENDPOINT: '/odin/remove/workspace/',
    DEPLOY_SERVICE_ENDPOINT: '/odin/service',
    UPDATE_SERVICE_ENDPOINT: '/odin/service',
    GET_SERVICE_ENDPOINT: '/odin/service/',
    GET_ALL_SERVICES_ENDPOINT: '/odin/services',
    DELETE_SERVICE_ENDPOINT: '/odin/service/',
    ROLLBACK_SERVICE_ENDPOINT: '/odin/service/rollback',
    WORKSPACE_INFORMATION_ENDPOINT: '/details/workspace/info/',
    ALL_WORKSPACES_ENDPOINT: '/details/workspaces/',
    ALL_SERVICES_IN_WORKSPACE_ENDPOINT: '/odin/services',
    ALL_DEPLOYMENTS_ENDPOINT: '/details/deployments/',
    SERVICE_INFORMATION_ENDPOINT: '/details/service/info/',
    CURRENT_CONFIGURATION_ENDPOINT: '/details/service/configuration/',
    ALL_CONFIGURATIONS_ENDPOINT: '/details/service/configurationall',
    DETAILS_HEALTH_CHECK_ENDPOINT: '/health',
    POLLING_CREATE_WORKSPACE_ENDPOINT: '/polling/deploy/workspace/',
    POLLING_DELETE_WORKSPACE_ENDPOINT: '/polling/remove/workspace/',
    POLLING_DEPLOY_SERVICE_ENDPOINT: '/polling/deploy/service/',
    POLLING_UPDATE_SERVICE_ENDPOINT: '/polling/update/service/',
    POLLING_DELETE_SERVICE_ENDPOINT: '/polling/delete/service'
}

// Deploy a service
app.post('/odin/service', (req, res, next) => {
    let apiUrl = endpoints.ODIN_SERVICE_URL + endpoints.DEPLOY_SERVICE_ENDPOINT;
    let logObj = {
        'path': endpoints.DEPLOY_SERVICE_ENDPOINT,
        'method': 'POST',
        'headers': req.headers,
        'input': req.body
    }

    let payload = req.body;

    if (Object.entries(payload).length === 0) {
        res.status(400);
        res.send({
            'msg': 'Bad Request. No payload found.'
        })
    }

    axios({
        method: 'post',
        url: apiUrl,
        data: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
        res.status(rep.status);
        res.send(rep.data);
    }).catch(err => {
        logObj.note = 'Exception encountered = '.concat(err.response);
        logger.error(logObj);
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    })
});

// Delete a service with serviceId
app.delete('/odin/service/:serviceId', (req, res, next) => {
    let apiUrl = endpoints.ODIN_SERVICE_URL + endpoints.DELETE_SERVICE_ENDPOINT
        + req.params.serviceId;

    let logObj = {
        'path': endpoints.DELETE_SERVICE_ENDPOINT + req.params.serviceId,
        'method': 'DELETE',
        'headers': req.headers,
        'input': req.params.serviceId
    }

    axios({
        method: 'delete',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
        res.status(rep.status);
        res.send({
            'msg': rep.data
        })
    }).catch(err => {
        logObj.note = 'Exception encountered = '.concat(JSON.stringify(err.message));
        logger.info(logObj);
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    });

});

// Get all existing services
app.get('/odin/services/', (req, res, next) => {
    let apiUrl = endpoints.ODIN_SERVICE_URL + endpoints.GET_ALL_SERVICES_ENDPOINT;

    let logObj = {
        'path': endpoints.GET_ALL_SERVICES_ENDPOINT,
        'method': 'GET',
        'headers': req.headers,
        'input': ''
    }

    axios({
        method: 'get',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
        res.status(rep.status);
        res.send({
            'msg': rep.data
        })
    }).catch(err => {
        logObj.note = 'Error encountered = '.concat(err.message);
        logger.info(logObj);
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    })
});

// Update a service with parameters
app.put('/odin/service', (req, res, next) => {
    let apiUrl = endpoints.ODIN_SERVICE_URL + endpoints.UPDATE_SERVICE_ENDPOINT;

    let logObj = {
        'path': endpoints.UPDATE_SERVICE_ENDPOINT,
        'method': 'PUT',
        'headers': req.headers,
        'input': req.body
    }

    let payload = req.body;

    if (Object.entries(payload).length === 0) {
        res.status(400);
        res.send({
            'msg': 'Bad request. No payload found.'
        })
    }

    axios({
        method: 'put',
        url: apiUrl,
        data: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
        res.status(rep.status);
        res.send({
            'msg': rep.data
        });
    }).catch(err => {
        logObj.note = 'Error encountered = '.concat(err.message);
        logger.error(logObj);
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    })
});

// Service rollback API
app.post('/odin/service/rollback', (req, res, next) => {
    let apiUrl = endpoints.ODIN_SERVICE_URL + endpoints.ROLLBACK_SERVICE_ENDPOINT;

    let logObj = {
        'path': endpoints.ROLLBACK_SERVICE_ENDPOINT,
        'method': 'POST',
        'headers': req.headers,
        'input': req.body
    }

    if (Object.entries(req.body).length === 0) {
        logObj.note = 'Bad input. No payload found.';
        logger.error(logObj);
        res.status(400);
        res.send({
            'msg': 'Bad request. No payload found.'
        })
    }

    axios({
        method: 'post',
        url: apiUrl,
        data: req.body,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
        res.status(rep.status);
        res.send({
            'msg': rep.data
        })
    }).catch(err => {
        logObj.note = 'Error encountered = '.concat(err.message);
        logger.error(logObj);
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    });
})

// Get service status
app.get('/odin/service/:serviceName/status', (req, res, next) => {
    let apiUrl = endpoints.ODIN_SERVICE_URL + '/odin/service/' + req.params.serviceName + '/status/';

    let logObj = {
        'path': apiUrl,
        'method': 'GET',
        'headers': req.headers,
        'input': req.body
    }

    axios({
        method: 'get',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
        res.status(rep.status);
        res.send({
            'msg': rep.data
        });
    }).catch(err => {
        logObj.note = 'Error encountered = '.concat(err.message);
        logger.error(logObj);
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    })
});


app.get('/details/health', (req, res, next) => {
    let apiUrl = endpoints.ODIN_SERVICE_URL + endpoints.DETAILS_HEALTH_CHECK_ENDPOINT;
    let logObj = {
        'path': '/details/health',
        'method': 'GET',
        'headers': req.headers,
        'input': ''
    }
    axios({
        method: 'get',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => {
        res.status(rep.status);
        res.send({
            'msg': rep.data
        });
    }).catch(err => {
        logObj.note = 'Error encountered = '.concat(err.message);
        logger.error(logObj);
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    })
})

app.get('/health', (req, res, next) => {
    res.status(200);
    res.send({
        'msg': 'Titan is up !'
    });
});

module.exports = app;

