require("dotenv").config();
require("./connection");

const express = require("express");
const api = require("./api/api");
const cors = require("cors");
const app = express();


app.use(express.json());
app.use(cors());

app.use("/api",api);

const port = process.env.PORT;
app.listen(port, console.log(`server is running at ${port}....`));