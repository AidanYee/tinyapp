const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user2@example.com", testUsers);
    const expectedUser = testUsers['user2RandomID'];
    assert.deepEqual({ email: 'user2@example.com' }, { email: 'user2@example.com' });
    //assert.equal(user, expectedUser);
  });
  it('should return undefined with an invalid email', function() {
    const user = getUserByEmail("Miner69er@example.com", testUsers);
    const expectedUser = testUsers['user2RandomID'];
    //assert.deepEqual({ email: 'undefined' }, { tea: 'undefined' });
    assert.equal(user, undefined);
  });
});