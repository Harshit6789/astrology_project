require("dotenv").config();
const express = require("express");
const app = express();
const userApi = require("./api/userData-api");

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
app.use("/api",userApi);
app.listen(5000, console.log("server is running at 5000....."));