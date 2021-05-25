const mongoose = require("mongoose");
const url = process.env.db;
let connectionFile = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, }, (err) => {
    if (!err) {
        console.log("db is connected");
    } else {
        console.log("Some occur is occured" + err);
    }
})

module.exports = connectionFile;