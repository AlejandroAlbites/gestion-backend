const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRouter = require("./routes/user");
const projectRouter = require("./routes/project");
const groupRouter = require("./routes/group");
const technicianRouter = require("./routes/technician");

const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

//EndPoints
app.use("/auth", userRouter);
app.use("/api", projectRouter);
app.use("/api", groupRouter);
app.use("/api", technicianRouter);

module.exports = app;
