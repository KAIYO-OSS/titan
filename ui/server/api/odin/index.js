
const express = require("express");
const app = express.Router();

const odinBaseUrl = 'http://localhost:8083/api';

/* details apis */
const workspaceInformation = '/details/workspace/info/'; // workspaceId
const allUserWorkspaces = '/details/workspaces/'; // userId
const allUserServicesInWorkspace = '/details/services/'; // workspaceId
const allUserDeployment = '/details/deployments/'; // userId
const serviceInformation = '/details/service/info/'; // deploymentId
const currentConfiguration = '/details/service/configuration/'; // deploymentId
const allConfiguration = '/details/service/configurationall';

app.get('/health', (req, res, next) => {
    res.send({'Hello': 'World'});
});

app.get('/docs', (req, res, next) => {
    fetch('http://localhost:5000/docs').then(resp => {res.send(resp.body)});
});

app.get('/', (req, res, next) => {
    fetch(odinBaseUrl + workspaceInformation)
    .then(resp => resp.json())
    .then(resp => {res.send(resp.body)});
});

module.exports = app;

