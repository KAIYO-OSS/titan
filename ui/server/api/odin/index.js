const express = require("express");
const app = express.Router();
const fetch = require('node-fetch')
const odinBaseUrl = 'http://localhost:5000';

/* Consider

/* Odin APIs */
const deployWorkspace = '/odin/deploy/workspace/';
const deleteWorkspace = '/odin/remove/workspace/'; // workspaceId
const deployService = '/odin/deploy/service/';
const updateDeployService = '/odin/update/service/';
const deleteDeployment = '/odin/remove/service/'; // deploymentId

app.post('/odin/deploy/workspace/', (req, res, next) => {
    console.log('Deploy workspace called with req =>', req.body);

    fetch(odinBaseUrl + deployWorkspace)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
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

    fetch(odinBaseUrl + deleteDeployment + req.params.workspaceId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
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

    fetch(odinBaseUrl + deployService)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
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

    fetch(odinBaseUrl + updateDeployService)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
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

    fetch(odinBaseUrl + deleteDeployment + req.params.deploymentId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
    /*
    res.send({
         "status": 200,
         "metadata": {},
         "error": ""
    });
    */
});

/* Details APIs */
const workspaceInformation = '/details/workspace/info/';
const allUserWorkspaces = '/details/workspaces/';
const allUserServicesInWorkspace = '/details/services/';
const allUserDeployment = '/details/deployments/';
const serviceInformation = '/details/service/info/';
const currentConfiguration = '/details/service/configuration/';
const allConfiguration = '/details/service/configurationall';
const detailsHealthCheck = '/details/healthChecker'

app.get('/details/healthChecker', (req, res, next) => {
    console.log('Details API healthchecker called...');
    fetch(odinBaseUrl + detailsHealthCheck)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        })
        .catch(e => {
            res.send({exception: "error getting health : " + e, status: 500})
        })
})

app.get('/health', (req, res, next) => {
    res.send({'Hello': 'World'});
});

app.get('/details/workspace/info/:workspaceId', (req, res, next) => {
    console.log('Workspace Information called for workspaceId => ' + req.params.workspaceId);
    fetch(odinBaseUrl + workspaceInformation + req.params.workspaceId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

app.get('/details/workspace/:userId', (req, res, next) => {
    console.log('All User workspaces called for usedId => ' + req.params.userId);
    fetch(odinBaseUrl + allUserWorkspaces + req.params.userId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

app.get('/details/services/:workspaceId', (req, res, next) => {
    console.log('All user services in workspaces called for workspaceId => ' + req.params.workspaceId);
    fetch(odinBaseUrl + allUserServicesInWorkspace + req.params.workspaceId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

app.get('/details/deployments/:userId', (req, res, next) => {
    console.log('All user deployments called for userId => ' + req.params.userId);
    fetch(odinBaseUrl + allUserDeployment + req.params.userId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

app.get('/details/service/info/:deploymentId', (req, res, next) => {
    console.log('Service information called for deploymentId => ' + req.params.deploymentId);
    fetch(odinBaseUrl + serviceInformation + req.params.deploymentId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

app.get('/details/service/configuration/:deploymentId', (req, res, next) => {
    console.log('Current configuration called for deploymentId => ' + req.params.deploymentId);
    fetch(odinBaseUrl + currentConfiguration + req.params.deploymentId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

app.get('/details/service/configurationall', (req, res, next) => {
    console.log('All configurations called');
    fetch(odinBaseUrl + currentConfiguration)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

/* Polling APIs */
const pollingCreateWorkspace = '/polling/deploy/workspace/'; //workspaceId
const pollingDeleteWorkspace = '/polling/remove/workspace/'; //workspaceId
const pollingDeployService = '/polling/deploy/service/'; //deploymentId
const pollingUpdateService = '/polling/update/service/'; //deploymentId
const pollingDeleteService = '/polling/delete/service/'; //deployemtId

app.get('/polling/deploy/workspace/:workspaceId', (req, res, next) => {
    console.log('Polling create workspace called for workspaceId => ' + req.params.workspaceId);
    fetch(odinBaseUrl + pollingCreateWorkspace + req.params.workspaceId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

app.get('/polling/remove/workspace/:workspaceId', (req, res, next) => {
    console.log('Polling delete workspace called for workspaceId =>' + req.params.workspaceId);
    fetch(odinBaseUrl + pollingDeleteWorkspace + req.params.workspaceId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

app.get('/polling/deploy/service/:deploymentId', (req, res, next) => {
    console.log('Polling deploy service called for deploymentId => ' + req.params.deploymentId);
    fetch(odinBaseUrl + pollingDeployService + req.params.deploymentId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

app.get('/polling/update/service/:deploymentId', (req, res, next) => {
    console.log('Polling update service called for deploymentId =>' + req.params.workspaceId);
    fetch(odinBaseUrl + pollingUpdateService + req.params.workspaceId)
        .then(odinResp => {
            return odinResp.json()
        })
        .then(aboveResp => {
            res.send(aboveResp.body)
        });
});

module.exports = app;

