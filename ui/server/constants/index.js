module.exports = Object.freeze({
    JWT_SECRET : process.env.JWT_SECRET || "E3A77CDE26D92E89EEE2B683AC554",
    SERVICE_NAME : process.env.SERVICE_NAME || "titan-ui-middleware",
    PORT : process.env.PORT || 8083,
    DB_URL : process.env.ETCD3_URL || "127.0.0.1:2379",
    TEST_JWT : process.env.TEST_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQW51cmFnIFNhcmthciIsImFjbFRva2VuIjoiYTFuMnUzcjRhNWc2IiwiZW1haWwiOiJhbnVyYWcuc2Fya2FyMjUwQGdtYWlsLmNvbSJ9.Xs_8_qbBYJOFcKmJAtQ9kWDCDR0cRPDlTHXWg5os7O0"
});



