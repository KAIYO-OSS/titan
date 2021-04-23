const express = require("express");
const axios = require("axios");
const app = express.Router();
const odinBaseUrl = 'http://odin';

/* Consider

/* Odin APIs */
const deployWorkspace = '/odin/deploy/workspace/';
const deleteWorkspace = '/odin/remove/workspace/'; // workspaceId
const deployService = '/odin/deploy/service/';
const updateDeployService = '/odin/update/service/';
const deleteDeployment = '/odin/remove/service/'; // deploymentId

/* Details APIs */
const workspaceInformation = '/details/workspace/info/';
const allUserWorkspaces = '/details/workspaces/';
const allUserServicesInWorkspace = '/details/services/';
const allUserDeployment = '/details/deployments/';
const serviceInformation = '/details/service/info/';
const currentConfiguration = '/details/service/configuration/';
const allConfiguration = '/details/service/configurationall';
const detailsHealthCheck = '/details/healthChecker'

/* Polling APIs */
const pollingCreateWorkspace = '/polling/deploy/workspace/'; //workspaceId
const pollingDeleteWorkspace = '/polling/remove/workspace/'; //workspaceId
const pollingDeployService = '/polling/deploy/service/'; //deploymentId
const pollingUpdateService = '/polling/update/service/'; //deploymentId
const pollingDeleteService = '/polling/delete/service/'; //deployemtId

app.post('/odin/deploy/workspace/', (req, res, next) => {
    console.log('Deploy workspace called with req =>', req.body);

    axios.get(odinBaseUrl + deployWorkspace)
        .then(rep => {
            res.send(rep.data)
        });
    /*
     res.send( {
         "status": 200,
         "metadata": {},
         "error": ""
     });
     */
});

app.delete('/odin/remove/workspace/:workspaceId', (req, res, next) => {
    console.log('Delete workspace called with workspaceId => ', req.params.workspaceId);

    axios.get(odinBaseUrl + deleteDeployment + req.params.workspaceId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
    /*
    res.send({
        "status": 200,
        "metadata": {},
        "error": ""
    });
    */
});

app.post('/odin/deploy/service/', (req, res, next) => {
    console.log('Deploy workspace called with req => ', req.body);

    axios.get(odinBaseUrl + deployService)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
    /*
    res.send({
        "status": 200,
        "metadata": {
                "url": "https://kaiyo.dev",
                "ip": "10.22.178.188"
        },
        "error": ""
    });
    */
});

app.post('/odin/update/service/', (req, res, next) => {
    console.log('Update service called with req => ', req.body);

    axios.get(odinBaseUrl + updateDeployService)
        .then(aboveResp => {
            res.send(aboveResp.data)
        })
    /*
    res.send({
        "status": 200,
        "metadata": {},
        "error": ""
    });
    */
});

app.delete('/odin/remove/service/:deploymentId', (req, res, next) => {
    console.log('Delete deployment called with req => ', req.params.deploymentId);

    axios.get(odinBaseUrl + deleteDeployment + req.params.deploymentId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
    /*
    res.send({
         "status": 200,
         "metadata": {},
         "error": ""
    });
    */
});

app.get('/details/healthChecker', (req, res, next) => {
    console.log('Details API healthchecker called...');
    axios.get(odinBaseUrl + detailsHealthCheck)
        .then(aboveResp => {
            res.send(aboveResp.data)
        })
})

app.get('/health', (req, res, next) => {
    res.send({'Hello': 'World'});
});

app.get('/details/workspace/info/:workspaceId', (req, res, next) => {
    console.log('Workspace Information called for workspaceId => ' + req.params.workspaceId);
    axios.get(odinBaseUrl + workspaceInformation + req.params.workspaceId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
});

app.get('/details/workspace/:userId', (req, res, next) => {
    console.log('All User workspaces called for usedId => ' + req.params.userId);
    axios.get(odinBaseUrl + allUserWorkspaces + req.params.userId)
        .then(aboveResp => {
            res.send(aboveResp.data)
        });
});

app.get('/details/services/:workspaceId', (req, res, next) => {
    console.log('All user services in workspaces called for workspaceId => ' + req.params.workspaceId);
    axios.get(odinBaseUrl + allUserServicesInWorkspace + req.params.workspaceId)
        .then(aboveResp => {
            res.send(aboveResp.data)
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
    console.log('Polling create workspace called for workspaceId => ' + req.params.workspaceId);
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

