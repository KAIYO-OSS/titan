const express = require("express");
const app = express.Router();

const odinBaseUrl = 'http://localhost:8083/api';

/* details apis */
const workspaceInformation = '/details/workspace/info/'; 
const allUserWorkspaces = '/details/workspaces/'; 
const allUserServicesInWorkspace = '/details/services/'; 
const allUserDeployment = '/details/deployments/'; 
const serviceInformation = '/details/service/info/'; 
const currentConfiguration = '/details/service/configuration/';
const allConfiguration = '/details/service/configurationall';

app.get('/health', (req, res, next) => {
    res.send({'Hello': 'World'});
});

app.get('/details/workspace/info/:workspaceId', (req, res, next) => {
    fetch(odinBaseUrl + workspaceInformation + req.params.workspaceId)
        .then(odinResponse => {
            return odinResponse.json()
        })
        .then(aboveResponse => {
            res.send(aboveResonse.body)
        });
});

app.get('/details/workspace/:userId', (req, res, next) => {
    fetch(odinBaseUrl + allUserWorkspaces + req.params.userId)
        .then(odinResponse => {
            return odinResponse.json()
        })
        .then(aboveResponse => {
            res.send(aboveResponse.body)
        });
});

app.get('/details/services/:workspaceId', (req, res, next) => {
    fetch(odinBaseUrl + allUserServicesInWorkspace + req.params.workspaceId)
        .then(odinResponse => {
            return odinResponse.json()
        })
        .then(aboveResponse => {
            res.send(aboveResponse.body)
        });
});

app.get('/details/deployments/:userId', (req, res, next) => {
    fetch(odinBaseUrl + allUserDeployment + req.params.userId)
        .then(odinResponse => {
            return odinResponse.json()
        })
        .then(aboveResponse => {
            res.send(aboveResponse.body)
        });
});

app.get('/details/service/info/:deploymentId', (req, res, next) => {
    fetch(odinBaseUrl + serviceInformation + req.params.deploymentId)
        .then(odinResponse => {
            return odinResponse.json()
        })
        .then(aboveResponse => {
            res.send(aboveResponse.body)
        });
});

app.get('/details/service/configuration/:deploymentId', (req, res, next) => {
    fetch(odinBaseUrl + currentConfiguration + req.params.deploymentId)
        .then(odinResponse => {
            return odinResponse.json()
        })
        .then(aboveResponse => {
            res.send(aboveResponse.body)
        });
});

app.get('/details/service/configurationall', (req, res, next) => {
    fetch(odinBaseUrl + currentConfiguration)
        .then(odinResponse => {
            return odinResponse.json()
        })
        .then(aboveResponse => {
            res.send(aboveResponse.body)
        });
});

module.exports = app;

