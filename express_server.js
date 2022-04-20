const express = require("express");
const app = express();
const PORT = 8084; // default port 8080 not working
const bodyParser = require("body-parser"); // middleware
const cookieParser = require("cookie-parser"); // cookie middleware
const morgan = require("morgan");

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

const users = {
  "userRandomID" : {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
  "user2randomID" : {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "321"
  }
};


app.set("view engine", "ejs");

// middleware
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.use(morgan('dev'));

// routes
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

// creates TinyURL submission box page
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

// shows the shortened url & it's non-shortened variant
app.get('/urls/:id', (req, res) => {
  const templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"],};
  res.render('urls_show', templateVars);
});

// short url that redirects to it's non-shortened variant
app.get('/u/:shortURL', (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

// registration page
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_registration", templateVars);
});



// //app.post('/register', (req, res) => {
  
// });

// creates a new shortened string for url & redirects to /urls/
app.post('/urls', (req, res) => {
  let rngString = generateRandomString(6);
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
  const shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
});

// login - when no cookies are saved
app.post('/login', (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

// logout - when cookie is saved
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// sends message when server is started
app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});