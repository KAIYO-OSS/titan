//import {PORT} from "./constants";

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("./logger");
const api = require("./api")

const app = express();

logger.info(path.join(__dirname, "..", "build"));

var server = app
    .get("/health-check", (req, res) => res.send("OK"))
    .use("/api", api)
    .use(cors())
    .use(express.static(path.join(__dirname, "..", "build")))
    .use(bodyParser.json())
    .get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "build/index.html"));
    })
    .listen(8085, () => console.log(`Server started http://localhost:8081`));

server.setTimeout(2000);
