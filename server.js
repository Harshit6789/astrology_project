require("dotenv").config();
const express = require("express");
const api = require("./api/api");
const cors = require("cors");
const app = express();

const url = process.env.db;
const mongoose = require("mongoose");
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) {
        console.log("db is connected");
    } else {
        console.log("Some occur is occured" + err);
    }
})
app.use(express.json());
app.use(cors());

app.use("/api",api);

const port = process.env.PORT;
app.listen(port, console.log(`server is running at ${port}.....`));