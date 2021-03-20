import {DB_URL} from "../constants";

const {Etcd3} = require('etcd3');
const client = new Etcd3({hosts: DB_URL});


export async function get(key) {
    let data;
    data = await client.get(key)
    return data;
}

export async function put(key, value) {
    let data;
    data = await client
        .put(key)
        .value(value)
    console.log(`put executed with key := ${key} and value := ${value}`)
    return data
}

export async function prefixFind(key) {
    let data;
    data = await client.getAll().prefix(key).keys();
    return data;
}

export async function del(key) {
    let data;
    data = await client.delete().key(key);
    console.log(`delete executed with key := ${key}`)
    return data;
}
