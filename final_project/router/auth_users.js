const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

/* 
  You will next check if the username and password match what you have in the list of registered users. 
  It returns a boolean depending on whether the credentials match or not. This is also a utility function and not an endpoint.
*/
const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if ( authenticatedUser(username, password) ) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });//Creates an access token that is valid for 1 hour (60 X 60 seconds) and logs the user in, if the credentials are correct.
    
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.body.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if ( books[isbn].reviews.user === username ){//si el username ya escribió una reseñan anteriormente para ese libro, entonces se reescribe
    books[isbn].reviews = {
      user: username,
      review: review
    };
  }else{

    books[isbn].reviews = {
      user: username,
      review: review
    };
  }
  
  return res.status(300).json({message: books[isbn]});
});

// Delete reviews
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if ( books[isbn].reviews.user === username ){
    // Elimina la reseña del usuario
    delete books[isbn].reviews.user;
    delete books[isbn].reviews.review;
  }

  return res.status(300).json({
    after_delete: books[isbn]
  });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

//This contains the skeletal implementations for the routes which an authorized user can access.
