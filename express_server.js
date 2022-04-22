const express = require("express");
const app = express();
const PORT = 8081; // default port 8080 not working
const bodyParser = require("body-parser"); // middleware
const cookieSession = require('cookie-session');// cookie session middleware
const morgan = require("morgan"); // middleware
const bcrypt = require('bcryptjs');
const { urlDatabase, users, generateRandomString, getUserByEmail, urlsForUser } = require("./helpers");
app.set("view engine", "ejs");

// middleware
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cookieSession({
  name: "session",
  keys: ["hodl", "leverage"]
}));

app.use(morgan("dev"));

// routes
app.get("/", (req, res) => {
  if (!req.session) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

// main url page
app.get("/urls", (req, res) => {
  if (!req.session['user_id']) {
    res.redirect('/login');
  } else {
    const userURLs = urlsForUser(req.session['user_id'], urlDatabase);
    const templateVars = {
      urls: userURLs,
      user: users[req.session['user_id']]
    };
    res.render('urls_index', templateVars);
  }
  
});

// shows full + shortened URLs
app.get("/urls/new", (req, res) => {
  if (!req.session["user_id"]) {
    res.redirect('/login');
  } else {
    const userID = req.session["user_id"];
    const userURLs = urlsForUser(userID, urlDatabase);
    const templateVars = {
      user: users[req.session['user_id']],
      urls: userURLs
    };
    
    res.render("urls_new", templateVars);
  }
});

// short url that redirects to it's non-shortened variant
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// editing short url
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session['user_id'];
  const urlEntry = urlDatabase[req.params.shortURL];
  if (urlEntry.userID !== userID) {
    return res.send(403);
  }
  const templateVars =
  { shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[userID]};
  res.render("urls_show", templateVars);
});

// registration page
app.get("/register", (req, res) => {
  const templateVars = {
    user: req.session["user_id"],
  };
  res.render("urls_registration", templateVars);
});

// login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: null,
  };
  res.render("urls_login", templateVars);
});

// login page
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  if (!user) {
    res.status(403).send("User does not exist");
  } else {
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session['user_id'] = user.id;
      res.redirect("/urls");
    } else {
      res.status(403).send("Wrong password or Username");
    }
  }
});

// registration page
app.post("/register", (req, res) => {
  if (req.body["email"] === "" || req.body["password"] === "") {
    res
      .status(400)
      .send(
        "Can not submit an empty email or password field. Please enter a valid email & password and try again."
      );
  } else if (getUserByEmail(req.body["email"], users)) {
    res
      .status(400)
      .send(
        "Email is already registered. Please register with a different email address."
      );
  } else {
    const rngUserID = generateRandomString(4);
    users[rngUserID] = {
      id: rngUserID,
      email: req.body["email"],
      password: bcrypt.hashSync(req.body["password"]),
    };
    res.cookie("user_id", rngUserID);
    res.redirect("/urls");
  }
});

// creates a new shortened string for url & redirects to /urls/id
app.post("/urls", (req, res) => {
  if (!req.session['user_id']) {
    res
      .status(403)
      .send("Please login in.");
  } else {
    let rngString = generateRandomString(6);
    urlDatabase[rngString] = {
      longURL: req.body.longURL,
      userID: req.session['user_id']
    };
    res.redirect("/urls/" + rngString);
  }
});

// removes a URL resource
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session['user_id']) {
    res
      .status(403)
      .send("Please login in order to make changes.");
  }
  const id = req.session['user_id'];
  const shortURL = req.params.shortURL;
  if (id === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

// editing links
app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session['user_id'];
  const shortURL = req.params.shortURL;
  const urlOwner = urlDatabase[req.params.shortURL];
  if (urlOwner.userID !== userID) {
    return res.send(403);
  }
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session.user_id};
  res.redirect(`/urls/${shortURL}`);
});

// logout - when cookie is saved
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// sends message when server is started
app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});