module.exports = Object.freeze({
    ADMIN_EMAIL_ADDRESS: process.env.JWT_SECRET || 'admin',
    ADMIN_ACL_TOKEN: process.env.ADMIN_ACL_TOKEN || 'admin',
    JWT_SECRET : process.env.JWT_SECRET || 'VmYq3t6v9y$B&E)H@McQfTjWnZr4u7x!',
    SERVICE_NAME : process.env.SERVICE_NAME || 'titan-ui-middleware',
    PORT : process.env.PORT || 8083,
    DB_URL : process.env.ETCD3_URL || '127.0.0.1:2379',
    TEST_JWT : process.env.TEST_JWT || 'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbEFkZHJlc3MiOiJhbnVyYWcuc2Fya2FyMjUwQGdtYWlsLmNvbSIsImFjbFRva2VuIjoiYWJjMTIzIn0.8AXDnR87Pk2S4__uoAVpb7GTh2E6LhuglsKSsOeHRBo',
    APP_COMMON_SECRET: process.env.APP_COMMON_SECRET || 'kaiyo@123',
    SAMPLE_ACL_TOKEN : process.env.SAMPLE_ACL_TOKEN || 'ar3i89wensdkwe23s',
    ODIN_SERVICE_URL: process.env.ODIN_SERVICE_URL || 'http://eba4ab5049ce.ngrok.io',
    DEPLOY_WORKSPACE_ENDPOINT: process.env.DEPLOY_WORKSPACE_ENDPOINT || '/odin/deploy/workspace',
    DELETE_WORKSPACE_ENDPOINT: process.env.DELETE_WORKSPACE_ENDPOINT || '/odin/remove/workspace/',
    DEPLOY_SERVICE_ENPOINT: process.env.DEPLOY_SERVICE_ENDPOINT || '/odin/service',
    UPDATE_SERVICE_ENDPOINT: process.env.UPDATE_SERVICE_ENDPOINT || '/odin/service',
    GET_SERVICE_ENDPOINT: process.env.GET_SERVICE_ENDPOINT || '/odin/service/',
    GET_ALL_SERVICES_ENDPOINT: process.env.GET_ALL_SERVICES_ENDPOINT || '/odin/services',
    DELETE_SERVICE_ENDPOINT: process.env.DELETE_SERVICE_ENDPOINT || '/odin/service/',
    ROLLBACK_SERVICE_ENDPOINT: process.env.ROLLBACK_SERVICE_ENDPOINT || '/odin/service/rollback',
    WORKSPACE_INFORMATION_ENDPOINT: process.env.WORKSPACE_INFORMATION_ENDPOINT || '/details/workspace/info/',
    ALL_WORKSPACES_ENDPOINT: process.env.ALL_WORKSPACES_ENDPOINT || '/details/workspaces/',
    ALL_SERVICES_IN_WORKSPACE_ENDPOINT: process.env.ALL_SERVICES_IN_WORKSPACE_ENDPOINT || '/odin/services',
    ALL_DEPLOYMENTS_ENDPOINT: process.env.ALL_DEPLOYMENTS_ENDPOINT || '/details/deployments/',
    SERVICE_INFORMATION_ENDPOINT: process.env.SERVICE_INFORMATION_ENDPOINT || '/details/service/info/',
    CURRENT_CONFIGURATION_ENDPOINT: process.env.CURRENT_CONFIGURATION_ENDPOINT || '/details/service/configuration/',
    ALL_CONFIGURATIONS_ENDPOINT: process.env.ALL_CONFIGURATIONS_ENDPOINT || '/details/service/configurationall',
    DETAILS_HEALTHCHECK_ENDPOINT: process.env.DETAILS_HEALTHCHECK_ENDPOINT || '/health',
    POLLING_CREATE_WORKSPACE_ENDPOINT: process.env.POLLING_CREATE_WORKSPACE_ENDPOINT || '/polling/deploy/workspace/',
    POLLING_DELETE_WORKSPACE_ENDPOINT: process.env.POLLING_DELETE_WORKSPACE_ENDPOINT || '/polling/remove/workspace/',
    POLLING_DEPLOY_SERVICE_ENDPOINT: process.env.POLLING_DEPLOY_SERVICE_ENDPOINT || '/polling/deploy/service/',
    POLLING_UPDATE_SERVICE_ENDPOINT: process.env.POLLING_UPDATE_SERVICE_ENDPOINT || '/polling/update/service/',
    POLLING_DELETE_SERVICE_ENDPOINT: process.env.POLLING_DELETE_SERVICE_ENDPOINT || '/polling/delete/service'
});
