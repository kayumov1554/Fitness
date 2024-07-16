const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const usersFilePath = path.join(__dirname, "users.json");

app.use(express.static("public"));
app.use(bodyParser.json());

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username va parolni kiriting.");
  }

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server xatosi.");
    }

    let users = [];
    if (data) {
      users = JSON.parse(data);
    }

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(400).send("Bu username allaqachon ro'yxatdan o'tgan.");
    }

    users.push({ username, password });

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server xatosi.");
      }
      res.send("Muvaffaqiyatli ro'yxatdan o'tdingiz.");
    });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username va parolni kiriting.");
  }

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server xatosi.");
    }

    let users = [];
    if (data) {
      users = JSON.parse(data);
    }

    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      res.send("Muvaffaqiyatli kirdingiz.");
      document.getElementById("register").style.display = "none";
      document.getElementById("registerr").style.display = "none";
    } else {
      res.status(400).send("Noto'g'ri username yoki parol.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi.`);
});
