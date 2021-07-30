const {Etcd3} = require('etcd3');
const client = new Etcd3({hosts: process.env.ETCD3_URL});

const {Etcd3} = require('etcd3');
const client = new Etcd3({hosts: globals.DB_URL});

async function get(key) {
    try {
        return await client.get(key);
    } catch (e) {
        return null;
    }
}

async function put(key, value) {
    try {
        let data;
        data = await client
            .put(key)
            .value(value);
        return data
    } catch (err) {
        throw err
    }
}

async function prefixFind(key) {
    try {
        let data;
        data = await client.getAll().prefix(key).keys();
        return data;
    } catch (err) {
        throw err
    }
}

async function findAll() {
    try {
        let data;
        data = await client.getAll().keys();
        return data;
    } catch (err) {
        throw err
    }
}

async function del(key) {
    try {
        let data;
        data = await client.delete().key(key);
        return data;
    } catch (err) {
        throw err
    }
}

module.exports = {
    get,
    put,
    prefixFind,
    del,
    findAll
};
