require("dotenv").config();
require("./connection");

const express = require("express");
const userApi = require("./api/userApi");
const astrologerApi = require("./api/astrologerApi");
const packageApi = require("./api/astrologerPackageApi");
const cors = require("cors");
const app = express();

app.use(cors("http://localhost:3000"));

app.use("/api", userApi);
app.use('/astroApi', astrologerApi);
app.use("/packageApi", packageApi);


const port = process.env.PORT;
app.listen(port, console.log(`server is running at ${port}....`));