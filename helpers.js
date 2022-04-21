//Welcome 2 the help zone
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
const getUserByEmail = function(submittedEmail) {
  for (const user in users) {
    if (users[user].email === submittedEmail) {
      return users[user];
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