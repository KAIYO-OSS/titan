var etcdClient = require("./../db");
//
etcdClient.put("anurag.sarkar@gmail.com:email", "abc123:acl")
etcdClient.findAll().then(x => console.log(x))
// var p;
// anurag.sarkar250@gmail.com:email abc123:acl
// let k = etcdClient.get("s").then(res => {
//     console.log(res)
//     p = res
//     return p
// }).finally(res => p = res);
// console.log(p)
