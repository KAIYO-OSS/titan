const express = require("express");
const axios = require("axios");
const app = express.Router();
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

    let payload = req.body;

    if(Object.entries(payload).length === 0) {
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
        /*
        res.status(err.status);
        res.send({
            'msg': err.response.statusText
        })
         */
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
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
        /*
        res.status(err.status);
        res.send({
            'msg': err.response.statusText
        })
         */
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    });

});

// Get all existing services
app.get('/odin/services/', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.GET_ALL_SERVICES_ENDPOINT;

    let logObj = {
        'path': globals.GET_ALL_SERVICES_ENDPOINT,
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
        /*
        res.status(err.status);
        res.send({
            'msg': err.response.statusText
        })
         */
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    })
});

// Update a service with parameters
app.put('/odin/service', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.UPDATE_SERVICE_ENDPOINT;

    let logObj = {
        'path': globals.UPDATE_SERVICE_ENDPOINT,
        'method': 'PUT',
        'headers': req.headers,
        'input': req.body
    }

    let payload = req.body;

    if(Object.entries(payload).length === 0) {
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
        /*
        res.status(err.status);
        res.send({
            'msg': err.response.statusText
        })
         */
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    })
});

// Service rollback API
app.post('/odin/service/rollback', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + globals.ROLLBACK_SERVICE_ENDPOINT;

    let logObj = {
        'path': globals.ROLLBACK_SERVICE_ENDPOINT,
        'method': 'POST',
        'headers': req.headers,
        'input': req.body
    }

    if(Object.entries(req.body).length === 0) {
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
        /*
        res.status(err.status);
        res.send({
            'msg': err.response.statusText
        })
         */
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
        })
    });
})

// Get service status
app.get('/odin/service/:serviceName/status', (req, res, next) => {
    let apiUrl = globals.ODIN_SERVICE_URL + '/odin/service/' + req.params.serviceName + '/status';

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
        /*
        res.status(err.status);
        res.send({
            'msg': err.response.statusText
        })
         */
        res.status(500);
        res.send({
            'msg': 'Something went wrong'
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
        /*
        res.status(err.status);
        res.send({
            'msg': err.response.statusText
        })
         */
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

