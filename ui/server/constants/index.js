const JWT_SECRET = process.env.JWT_SECRET || "E3A77CDE26D92E89EEE2B683AC554";
const SERVICE_NAME = process.env.SERVICE_NAME || "titan-ui-middleware";
const PORT = process.env.PORT || 8083;
const DB_URL = process.env.ETCD3_URL || "127.0.0.1:2379";

export {PORT};
export {JWT_SECRET};
export {SERVICE_NAME};
export {DB_URL};


