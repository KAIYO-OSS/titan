var DB_URL = require("../constants");

const Etcd3 = require('etcd3');
const client = new Etcd3();

async function get(key) {
    let data;
    data = await client.get(key)
    return data;
}

async function put(key, value) {
    let data;
    data = await client
        .put(key)
        .value(value)
    console.log(`put executed with key := ${key} and value := ${value}`)
    return data
}

async function prefixFind(key) {
    let data;
    data = await client.getAll().prefix(key).keys();
    return data;
}

async function del(key) {
    let data;
    data = await client.delete().key(key);
    console.log(`delete executed with key := ${key}`)
    return data;
}

module.exports = {
    get,
    put,
    prefixFind,
    del
};
