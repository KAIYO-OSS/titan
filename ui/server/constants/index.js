module.exports = Object.freeze({
    JWT_SECRET : process.env.JWT_SECRET || "VmYq3t6v9y$B&E)H@McQfTjWnZr4u7x!",
    SERVICE_NAME : process.env.SERVICE_NAME || "titan-ui-middleware",
    PORT : process.env.PORT || 8083,
    DB_URL : process.env.ETCD3_URL || "127.0.0.1:2379",
    TEST_JWT : process.env.TEST_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbEFkZHJlc3MiOiJhbnVyYWcuc2Fya2FyMjUwQGdtYWlsLmNvbSIsImFjbFRva2VuIjoiYWJjMTIzIn0.8AXDnR87Pk2S4__uoAVpb7GTh2E6LhuglsKSsOeHRBo",
    SAMPLE_ACL_TOKEN : process.env.SAMPLE_ACL_TOKEN || "ar3i89wensdkwe23s"
});



