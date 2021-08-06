const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const api = require("./api");
const users = require("./api/users");
const constants = require("./constants")
const app = express();

console.log(process.env);

users.createDefaultAdminUser()
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log("Error creating default user. Error caused : "+ err)
        console.log("stopping Server . Db not available ")
        process.exit(1)
    })

app
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Expose-Headers", "x-access-token, Uid");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
        next();
    })
    .get("/health-check", (req, res) => res.send("OK"))
    .use("/api", api)
    .use("/users", users)
    .use(express.static(path.join(__dirname, "..", "build")))
    .use(bodyParser.json())
    .get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "build/index.html"));
    })
    .use(cors)
    .listen(constants.PORT, () => console.log(`Server started http://localhost:${constants.PORT}`));

app.timeout = 2000;