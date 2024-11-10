const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
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

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let getBooks = new Promise((resolve,reject) => {
        resolve(res.send(books));
    })

    getBooks.then( ( successMessage) => {
        res.send(successMessage);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let getBooks = new Promise((resolve,reject) => {
        resolve(books[isbn]);
    })

    getBooks.then( ( successMessage) => {
        res.send(successMessage);
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let authBooks = []
    let getBooks = new Promise((resolve,reject) => {

        if (author) {
            for(var i in books){
                if (books[i].author === author) {
                    authBooks.push(books[i]);
                }
            }    
            if (authBooks.length > 0) {
             resolve(JSON.stringify(authBooks,null,4));
            } else {
             reject("Author not found");
            }
        }
    });

    getBooks.then( ( successMessage) => {
        res.send(successMessage);
    })
    .catch((err) => {
        return res.status(300).json({message: err});
        });
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let titleBooks = []
    
    let getBooks = new Promise((resolve,reject) => {
        if (title) {
            for(var i in books){
                if (books[i].title === title) {
                    titleBooks.push(books[i]);
                }
            }    
            if (titleBooks.length > 0) {
                resolve(JSON.stringify(titleBooks,null,4));
            } else {
                reject ("Title not found");
            }
        }
    });

    getBooks.then( ( successMessage) => {
        res.send(successMessage);
    })
    .catch((err) => {
        return res.status(300).json({message: err});
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (isbn) {
        res.send(books[isbn].reviews);
    } else {
        return res.status(300).json({message: "ISBN not provided"});
    }

});

module.exports.general = public_users;
