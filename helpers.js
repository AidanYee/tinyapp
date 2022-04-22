//Welcome 2 the help zone
const bcrypt = require('bcryptjs');

const urlDatabase = {
  "b2xVn2":{
    longURL: "http://www.lighthouselabs.ca",
    userID: "3f5666"
  },
  "9sm5xK":{
    longURL: "http://www.google.com",
    userID:"3f5666"
  }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync('123'),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync('321'),
  },
};



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

//check if email is in database
const getUserByEmail = function(email, users) {
  for (const userID in users) {
    if (users[userID].email === email) {
      return users[userID];
    }
  }
  return undefined;
};

// checks if url is owned by session id
const urlsForUser = function(id, urlDatabase) {
  const filteredDatabase = {};

  for (let shortURL in urlDatabase) {
    const url = urlDatabase[shortURL];
    if (url.userID === id)
      filteredDatabase[shortURL] = url;
  }
  return filteredDatabase;
};

module.exports = {
  urlDatabase,
  users,
  generateRandomString,
  getUserByEmail,
  urlsForUser

};