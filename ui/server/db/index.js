const {Etcd3} = require('etcd3');
const client = new Etcd3({hosts: '0.0.0.0:2379'});

const logger = require('./../logger');

async function get(key) {
    try {
        let token = await client.get(key);
        return token;
    } catch (e) {
        return null;
    }
}

async function put(key, value) {
    let data;
    data = await client
        .put(key)
        .value(value);
    return data
}

async function prefixFind(key) {
    let data;
    data = await client.getAll().prefix(key).keys();
    return data;
}

async function findAll() {
    let data;
    data = await client.getAll().keys();
    return data;
}

async function del(key) {
    let data;
    data = await client.delete().key(key);
    return data;
}

module.exports = {
    get,
    put,
    prefixFind,
    del,
    findAll
};
