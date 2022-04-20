const express = require("express");
const app = express();
const PORT = 8081; // default port 8080 not working
const bodyParser = require("body-parser"); // middleware

// returns a random 6 character string
const characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateRandomString = function(length) {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// middleware
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

// routes
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// creates TinyURL submission box page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// shows the shortened url & it's non-shortened variant
app.get('/urls/:id', (req, res) => {
  const templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render('urls_show', templateVars);
});

// creates a new shortened string for url & redirects to /urls/
app.post('/urls', (req, res) => {
  const rngString = generateRandomString(6);
  urlDatabase[rngString] = req.body.longURL;
  res.redirect('/urls/' + rngString);
});

// removes a URL resource
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

// editing links
app.post('/urls/:id/', (req, res) => {
  const editUrl = req.params.id;
  urlDatabase[editUrl] = req.body.longURL;
  res.redirect("/urls");
});

// sends message when server is started
app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});