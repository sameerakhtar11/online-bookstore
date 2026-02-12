const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  }).then((b) => {
    res.send(JSON.stringify(b, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) resolve(book);
    else reject("Book not found");
  }).then((book) => {
    res.send(book);
  }).catch((err) => {
    res.status(404).json({ message: err });
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["author"] === author) {
        booksbyauthor.push({
          "isbn": isbn,
          "title": books[isbn]["title"],
          "reviews": books[isbn]["reviews"]
        });
      }
    });
    if (booksbyauthor.length > 0) resolve(booksbyauthor);
    else reject("No books found for this author");
  }).then((b) => {
    res.send(JSON.stringify(b, null, 4));
  }).catch((err) => {
    res.status(404).json({ message: err });
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["title"] === title) {
        booksbytitle.push({
          "isbn": isbn,
          "author": books[isbn]["author"],
          "reviews": books[isbn]["reviews"]
        });
      }
    });
    if (booksbytitle.length > 0) resolve(booksbytitle);
    else reject("No books found for this title");
  }).then((b) => {
    res.send(JSON.stringify(b, null, 4));
  }).catch((err) => {
    res.status(404).json({ message: err });
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
