
const express = require("express");
const app = express.Router();
// Main a list of odin endpoints

var odinGetDeploymentEndpoint = '/getDeployment/{deploymentId}'
app.get('/health', (req, res, next) => {
    res.send({'Hello': 'World'});
});

app.get('/docs', (req, res, next) => {
    fetch('http://localhost:5000/docs').then(resp => {res.send(resp.body)});
});
// app.get('/getDeployment/{deploymentId}', (req, res, next) => {
//
// })
module.exports = app;
// Nahin likhey toh milta nahin logon ko
