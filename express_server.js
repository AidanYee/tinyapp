const express = require("express");
const app = express();
const PORT = 8081; // default port 8080 not working
const bodyParser = require("body-parser"); // middleware
const cookieParser = require("cookie-parser"); // cookie middleware
const morgan = require("morgan");

// returns a random 6 character string
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateRandomString = function(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "123",
  },
  user2randomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "321",
  },
};

//helper function to check if email is in database
const emailCheck = function(submittedEmail) {
  for (const user in users) {
    if (users[user].email === submittedEmail) {
      return true;
    }
  }
  return false;
};

const getUserByEmail = function(submittedEmail) {
  for (const user in users) {
    if (users[user].email === submittedEmail) {
      return users[user];
    }
  }
  return undefined;
};

app.set("view engine", "ejs");

// middleware
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use(morgan("dev"));

// routes
app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  //console.log('user', user);
  const templateVars = {
    urls: urlDatabase,
    user: user,
  };
  res.render("urls_index", templateVars);
});

// creates TinyURL submission box page
app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = {
    user: user,
  };
  res.render("urls_new", templateVars);
});

// shows the shortened url & it's non-shortened variant
app.get("/urls/:id", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: user,
  };
  res.render("urls_show", templateVars);
});

// short url that redirects to it's non-shortened variant
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

// registration page
app.get("/register", (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"],
  };
  res.render("urls_registration", templateVars);
});

// login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"],
  };
  res.render("urls_login", templateVars);
});

// login page
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);
  if (!user) {
    res.status(403).send("User does not exist");
  } else {
    if (user.password === password) {
      res.cookie("user_id", user.id);
      res.redirect("/urls");
    } else {
      res.status(403).send("Wrong password");
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
  } else if (emailCheck(req.body["email"])) {
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
      password: req.body["password"],
    };
    res.cookie("user_id", rngUserID);
    res.redirect("/urls");
  }
});

// creates a new shortened string for url & redirects to /urls/
app.post("/urls", (req, res) => {
  let rngString = generateRandomString(6);
  urlDatabase[rngString] = req.body.longURL;
  res.redirect("/urls/" + rngString);
});

// removes a URL resource
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// editing links
app.post("/urls/:id/", (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
});

// logout - when cookie is saved
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// sends message when server is started
app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});
