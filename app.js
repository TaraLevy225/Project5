const express = require("express");
const session = require("express-session");

const Database = require("./db");
require("dotenv").config();

const db = new Database();
db.initialize();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('css'));

app.use((req, res, next) => {
  console.log("Adding DB to request");
  req.db = db;
  next();
});

app.use(
  session({
    secret: "cmps369",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = {
      id: req.session.user.id,
      email: req.session.user.email,
    };
  }
  next();
});

app.set("view engine", "pug");

app.use("/", require("./routes/accounts"));
app.use("/", require("./routes/contacts"));

app.listen(8080, () => {
  console.log("Server is running  on port 8080");
});
