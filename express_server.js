const express = require("express");
const app = express();
const PORT = 8081; // Default port 8080
const bodyParser = require("body-parser"); // Middleware

const generateRandomString = function() {
  const result = Math.random().toString(36).substring(2,8);
  console.log(result);
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

// Routes

// app.get("/", (req,res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// app.get("/urls/:shortURL", (req, res) => {
//   const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
//   res.render("urls_show", templateVars);
// });

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  urlDatabase[req.body.name] = req.body.name;
  urlDatabase[req.body.longURL] = req.body.longURL;
  res.send('Ok');
});

app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});