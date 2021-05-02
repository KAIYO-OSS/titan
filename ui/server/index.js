//import {PORT} from "./constants";

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("./logger");
const api = require("./api");
const jwt = require("jsonwebtoken");
const jwtSecret = "VmYq3t6v9y$B&E)H@McQfTjWnZr4u7x!";
const users = require("./users");

const app = express();

logger.info(path.join(__dirname, "..", "build"));

var server = app
    .get("/health-check", (req, res) => res.send("OK"))
    .get("/get-auth-token", (req, res) => res.send(jwt.sign(
        {
            "emailAddress": "anurag.sarkar@gmail.com",
            "aclToken": "abc123"
    }, jwtSecret, {algorithm: 'HS256'})
    ))
    .use("/api", api)
    .use("/users", users)
    .use(cors())
    .use(express.static(path.join(__dirname, "..", "build")))
    .use(bodyParser.json())
    .get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "build/index.html"));
    })
    .listen(8085, () => console.log(`Server started http://localhost:8085`));

//server.setTimeout(2000);
