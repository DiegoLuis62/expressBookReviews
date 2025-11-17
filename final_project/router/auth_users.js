const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean

    const UserFound = users.find(user => user.username === username)

    return !UserFound

}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    const userFound = users.find(user => user.username === username && user.password === password)
    return userFound
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        res.status(400).json({ message: "Información incompleta o inválida" });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const accessToken = jwt.sign({ username: username }, "secretkey", { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken: accessToken }
    return res.status(200).json({ message: "Login exitoso", username, token: accessToken });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username;

    if (!isbn || isNaN(isbn) || !review) { return res.status(400).json({ message: "Parametro Invalido o no enviado " }) }


    if (books[isbn]) {

        books[isbn].reviews = { ...books[isbn].reviews, [username]: req.body.review }
        res.status(201).json({
            message: "Added or updated review sucefully",
            "Your review": books[isbn].reviews[username]
        });

    } else {
        return res.status(404).json({ error: "reviews no encontrada" });
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
