const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) { return res.status(400).json({ message: "Usuario o contraseña no enviado" }) }
    if (!isValid(username)) { return res.status(400).json({ message: "Usuario ya existe" }) }

    users.push({ username, password })
    res.status(201).json({
        message: "Usuario registrado exitosamente",
        username: username
    })

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {

    res.send(JSON.stringify(books, null, 4));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    let isbn = req.params.isbn;
  

    if (!isbn || isNaN(isbn)) { return res.status(400).json({ message: "Parametro Invalido o no enviado " }) }

    if (books[isbn]) {
        res.json(books[isbn]);
    } else {
        return res.status(404).json({ error: "Libro no encontrado" });
    }

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;
    if (!author) { return res.status(400).json({ message: "Autor no enviado" }) }

    for (let isbn in books) {
        if (books[isbn].author === author) {
            return res.send(books[isbn])
        }
    }

    return res.status(404).json({ message: "Autor no encontrado" });

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    if (!title) { return res.status(400).json({ message: "titulo no enviado" }) }

    for (let isbn in books) {
        if (books[isbn].title === title) {
            return res.send(books[isbn])
        }
    }

    return res.status(404).json({ message: "titulo no encontrado" });


});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;
    

    if (!isbn || isNaN(isbn)) { return res.status(400).json({ message: "Parametro Invalido o no enviado " }) }

    if (books[isbn]) {
        res.json(books[isbn].reviews);
    } else {
        return res.status(404).json({ error: "reviews no encontrada" });
    }


});

module.exports.general = public_users;
