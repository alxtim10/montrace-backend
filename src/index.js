const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
app.use(express.json());
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
app.use(cors());

const trackerController = require("./tracker/tracker.controller");
const usersController = require("./users/users.controller");

app.use("/tracker", trackerController);
app.use("/users", usersController);

app.listen(PORT, () => {
  console.log("Express is running on PORT " + PORT);
});
