const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: "chatbot-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Serve frontend folder
app.use(express.static(path.join(__dirname, "..","frontend")));

let users = [];

// Signup API
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;

  users.push({ name, email, password });

  res.json({ message: "Signup successful" });
});

// Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    req.session.user = user;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Check session
app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// Logout
app.get("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
