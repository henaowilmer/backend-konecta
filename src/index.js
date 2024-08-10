const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("./passport.js");
const sequelize = require("./pg/index.js");
const { employeeRoutes, requestRoutes, authRoutes, userRoutes } = require("./routes/index.js");
const path = require("path");
const fs = require("fs");
const helmet = require('helmet');

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

const whitelist = [process.env.APP_URL_CLIENT];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Unable to connect to PostgreSQL:', err));

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json({ type: "application/vnd.api+json", strict: false }));

app.get("/", function (req, res) {
  const __dirname = fs.realpathSync(".");
  res.sendFile(path.join(__dirname, "/src/landing/index.html"));
});

app.use("/", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/requests", requestRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
