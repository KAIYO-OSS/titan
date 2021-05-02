let DB_URL = require("../constants");

const {Etcd3} = require('etcd3');
const client = new Etcd3({hosts: '0.0.0.0:2379'});

const logger = require('./../logger');


async function get(key) {
    try {
        let token = await client.get(key);
        console.log("The token from DB => %s", token);
        return token;
    } catch (e) {
        logger.info("ETCD GET error => %s", e);
        return null;
    }
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

async function findAll() {
    let data;
    data = await client.getAll().keys();
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
    del,
    findAll
};
