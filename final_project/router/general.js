const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// ---------------------
// Task 6: Register User
// ---------------------
public_users.post('/register', function (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const exists = users.find(u => u.username === username);
    if (exists) {
        return res.status(409).json({ message: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// -----------------------------------
// Task 10: Get all books (Async/Await)
// -----------------------------------
public_users.get('/', async (req, res) => {
    try {
        const getBooks = () => new Promise((resolve, reject) => {
            if (books) resolve(books);
            else reject("No books available");
        });

        const allBooks = await getBooks();
        res.status(200).json(allBooks);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// -----------------------------------
// Task 11: Get book by ISBN
// -----------------------------------
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const getBookByISBN = (isbn) => new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });

        const book = await getBookByISBN(isbn);
        res.status(200).json(book);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// -----------------------------------
// Task 12: Get books by author
// -----------------------------------
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();

    try {
        const getBooksByAuthor = () => new Promise((resolve, reject) => {
            const result = Object.values(books).filter(book => book.author.toLowerCase() === author);
            if (result.length > 0) resolve(result);
            else reject("No books found for this author");
        });

        const booksByAuthor = await getBooksByAuthor();
        res.status(200).json(booksByAuthor);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// -----------------------------------
// Task 13: Get books by title
// -----------------------------------
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();

    try {
        const getBooksByTitle = () => new Promise((resolve, reject) => {
            const result = Object.values(books).filter(book => book.title.toLowerCase() === title);
            if (result.length > 0) resolve(result);
            else reject("No books found with this title");
        });

        const booksByTitle = await getBooksByTitle();
        res.status(200).json(booksByTitle);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// -----------------------------------
// Get book review
// -----------------------------------
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
