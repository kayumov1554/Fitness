const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const usersFilePath = path.join(__dirname, "users.json");

app.use(express.static("public"));
app.use(bodyParser.json());

const readFileAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

const writeFileAsync = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username va parolni kiriting.");
  }

  try {
    const data = await readFileAsync(usersFilePath);
    let users = data ? JSON.parse(data) : [];

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(400).send("Bu username allaqachon ro'yxatdan o'tgan.");
    }

    users.push({ username, password });
    await writeFileAsync(usersFilePath, JSON.stringify(users, null, 2));
    res.send("Muvaffaqiyatli ro'yxatdan o'tdingiz.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi.");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username va parolni kiriting.");
  }

  try {
    const data = await readFileAsync(usersFilePath);
    let users = data ? JSON.parse(data) : [];

    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      res.send("Muvaffaqiyatli kirdingiz.");
    } else {
      res.status(400).send("Noto'g'ri username yoki parol.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server xatosi.");
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi.`);
});
