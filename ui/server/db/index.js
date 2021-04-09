let DB_URL = require("../constants");

const {Etcd3} = require('etcd3');
const client = new Etcd3({hosts: '0.0.0.0:2379'});


async function get(key) {
    try {
        return await client.get(key)
    } catch (e) {
        console.log(e)
        return null
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
