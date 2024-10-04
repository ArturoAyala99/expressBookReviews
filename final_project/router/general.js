const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const credentials = {
    username: req.body.username,
    password: req.body.password,
  }
  
  // Check if both username and password are provided
  if ( credentials.username && credentials.password ){
    // Check if the user does not already exist
    if ( !isValid(credentials.username) ){
      // Add the new user to the users array
      users.push({"username": credentials.username, "password": credentials.password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }else{
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //const all_books = JSON.stringify(books);
  //return res.status(300).json({message: all_books});

  //using Promise
  let myPromise = new Promise((resolve,reject) => {
    // Simulación de operación asíncrona
    setTimeout(() => {//No es necesario el setTimeOuts, solo es para que quede más claro
      const all_books = JSON.stringify(books);
      resolve(all_books);
    },1000); // Simulación de retraso de 1 segundo
  });

  myPromise.then((successMessage) => {//successMesage es el parámtero que coloqué en el "resolve()"
    return res.status(200).json({ message: successMessage });
  }).catch((error) => {
    return res.status(500).json({ message: 'Error retrieving books' });
  });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  /* 
    El ISBN ​ es un identificador único para libros.​ 
    Mediante este sistema, a cada libro se le asigna una cadena numérica única internacional que sirve para identificar datos básicos del objeto tales como título, editorial, tirada, extensión, materia, país, traductor, lengua original, etc.
  */
  //req.params.isb, estoy obteniendo el isbn desde la url
  //const req_book = req.params.isbn; //el isbn es el identificador que pongo en la url para decir cúal libro específico traer
  /*if ( isNaN(req_book) ){
    return res.status(300).json({message: "El isbn debe ser un número entero"});
  }
  return res.status(300).json({message: books[req_book]});*/

  //Using Promise
  let myPromise = new Promise( (resolve,reject) => {
    const req_book = req.params.isbn;

    if ( isNaN(req_book) ){
      reject("El isbn debe ser un número entero");
    }else{
      const book = books[req_book];

      if (book){
        resolve(book);
      }else{
        reject("Libro no encontrado");
      }
    }
  });

  myPromise.then((book_by_isbn) => {
    return res.status(200).json({ message: book_by_isbn});
  }).catch((error) => {
    return res.status(500).json({ message: error });
  });

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  /*let book = [];
  Object.keys(books).forEach(key => {
    if (books[key].author === req.params.author){
      book.push( {
        Book:books[key] 
      } );
    }
  });
  if (book.length <= 0){
    return res.status(300).json({message: "No se encontró ningún libro con ese autor"});
  }
  return res.status(300).json({message: book});*/

  let myPromiseAuthor = new Promise((resolve, reject) => {
    let book = [];

    Object.keys(books).forEach(key => {
      if (books[key].author === req.params.author){
        book.push( {
          Book:books[key] 
        } );
      }
    });

    if (book.length <= 0){
      reject("No se encontró ningún libro");
    }else{
      resolve(book);
    }
  });

  myPromiseAuthor.then((book_by_author) => {
    return res.status(200).json({message: book_by_author});
  }).catch((error) => {
    return res.status(500).json({ message: error });
  });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  /*let book = [];
  Object.keys(books).forEach(key => {
    if (books[key].title === req.params.title){
      book.push( {
        Book:books[key] 
      } );
    }
  });
  if (book.length <= 0){
    return res.status(300).json({message: "No se encontró ningún libro con ese título"});
  }
  return res.status(300).json({message: book});*/

  let myPromiseTitle = new Promise((resolve, reject) => {
    let book = [];

    Object.keys(books).forEach(key => {
      if (books[key].title === req.params.title){
        book.push( {
          Book:books[key] 
        } );
      }
    });

    if (book.length <= 0){
      reject("No se encontró ningún libro con ese título");
    }else{
      resolve(book);
    }

  });

  myPromiseTitle.then((book_by_title) => {
    return res.status(200).json({message: book_by_title});
  }).catch((error) => {
    return res.status(500).json({message: error});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const req_book = req.params.isbn;
  if ( isNaN(req_book) ){
    return res.status(300).json({message: "El isbn debe ser un número entero"});
  }
  return res.status(300).json({message: books[req_book].reviews});
});

public_users.post('/reviews/:isbn',function (req, res) {
  const review = req.body.review;
  const isbn = req.params.isbn;
  const username = "a";

  if ( books[isbn].reviews.username === username ){//si el username ya escribió una reseñan anteriormente para ese libro, entonces se reescribe
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

module.exports.general = public_users;


//This contains the skeletal implementations for the routes which a general user can access.