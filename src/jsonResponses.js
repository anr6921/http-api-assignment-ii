// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Get Users
const getUsers = (request, response, parsedUrl) => {
  if (parsedUrl === '/getUsers') {
    const responseJSON = { users };
    return respondJSON(request, response, 200, responseJSON);
  }
  const responseJSON = { message: 'Page not found' };
  return respondJSON(request, response, 404, responseJSON);
};

// Add User
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };
  // No fields entered
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  let responseCode = 201;

  // 204
  if (users[body.name]) {
    // Same name, different age => change age
    if (users[body.name].age !== body.age) {
      responseCode = 204;
      users[body.name].age = body.age;
      // console.log(`new age: ${users[body.name]}:${users[body.name].age} `);
    }
    // name and age already exsist
    if ((users[body.name].name === body.name) && (users[body.name].age === body.age)) {
      responseCode = 204;
    }
    return respondJSONMeta(request, response, responseCode);
  }
  users[body.name] = {};


  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

module.exports = {
  getUsers,
  addUser,
};
