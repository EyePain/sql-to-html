/*
Make sure to run these following commands in the terminal:
npm install node.js
npm install sqlite3
npm install express
npm install body-parser
npm install cors
Use 'node node.js' to run this file in the terminal
*/

// Get SQLite and create a new database
const sqlite3 = require('sqlite3');
let db = new sqlite3.Database('./database.db');

// When run, create a new table with random values
function makeTable() {
    db.serialize(() => { // Make sure that the SQL commands run in the correct order
        db.run("CREATE TABLE tutorial (exampleId INTEGER, exampleColor TEXT)"); // Create a new table 'tutorial'
        colors = ["Red","Blue"] // Create an array of the colors
        for (i=0;i<10;i++) {
            db.run("INSERT INTO tutorial (exampleId, exampleColor) VALUES (?,?)", [i, colors[Math.floor(Math.random() * colors.length)]]); // Create a row with an id and a random color
        }
    });
}

// Detect if the table 'tutorial' exists
db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='tutorial'`, (err, row) => {
    if (err) { // Display an error in the console
        console.error(err.message);
    } else if (row) { // Display the found table in the console
        console.log(`Table ${row.name} exists`);
    } else { // Create a new table
        makeTable();
    }
});

// Get Express.js and create an app
const express = require('express');
const app = express();

// Get body-parser and add it to the app
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get cors and add it to the app
const cors = require('cors');
app.use(cors());

// Have the app listen to port 5500 and display it to the console
app.listen(5500, () => {
    console.log('Server listening on port 5500');
});

// When a GET request is sent, send back a message to the client
app.get('/getData', (req, res) => {
    console.log("Got pinged by a client!")
    res.send("Hey, we're connected on this end.");
});

// Detect when a POST request is sent
app.post('/postData', (req, res) => {
    filter = req.body.data // Get the data sent by the client

    if (filter == "All") { // If the user is trying to get all the rows, then...
        db.all(`SELECT * FROM tutorial`, (err, rows) => {
            if (err) { // If there is an error getting rows, display the error to console
                console.error(err.message);
            } else {
                res.send(rows); // Send all the rows to the client
            }
        });
    } else if (filter == "Reload") { // If the user is trying to repopulate the database, then...
        db.run(`DROP TABLE tutorial`); // Delete the database
        makeTable(); // Create a new table
    } else { // If the user is querying a specific color, then...
        db.all(`SELECT * FROM tutorial WHERE exampleColor = '` + filter + `'`, (err, rows) => { // Find the rows with exampleColor = specified color
            if (err) { // If there is an error getting rows, display the error to console
                console.error(err.message);
            } else {
                res.send(rows); // Send the specified rows to the client
            }
        });
    }
});
