const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const api = require("./api");
const users = require("./api/users");
const constants = require("./constants")
const app = express();

console.log("UI server directory - " + path.join(__dirname, "..", "build"));

users.createDefaultAdminUser().then(r => {
    console.log("admin created ")
}).catch(err => {
    console.log("admin cannot be created ")
})

app
    .get("/health", (req, res) => res.send("OK"))
    .use("/api", api)
    .use(express.static(path.join(__dirname, "..", "build")))
    .use(bodyParser.json())
    .get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "build/index.html"));
    })
    .listen(constants.PORT, () => console.log(`Server started http://localhost:${constants.PORT}`));

app.timeout = 2000;