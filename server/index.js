const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./Routes/routes");

const corsOptions = {
  origin: process.env.FRONT_URL
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log("APP is Running");
});

