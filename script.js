// Set up the XMLHttpRequests
var xhr = new XMLHttpRequest();

// Send a GET request on webpage loading
xhr.open("GET", "http://localhost:5500/getData", true);
xhr.send();

// Detect responses from the server
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText.search("{") > -1) { // If the response has a '{', then...
            loadTable(xhr.responseText); // Use the data to populate the table
        } else { // If the response doesn't have a '{', then...
            console.log(xhr.responseText); // Post the response to the console
        }
    }
};

// If there is an error with the xhr, log it to the console
xhr.onerror = function () {
    console.error('An error occurred when sending an XMLHttpRequest...');
};

// Get the dropdown from the webpage
option = document.getElementById("select");

// When the Query button is pressed, send the value of the dropdown in a POST request to the server
function query() {
    xhr.open("POST", "http://localhost:5500/postData", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ data: option.value }));
}

// When the Reload Database button is pressed, send "Reload" in a POST request to the server
function reload() {
    xhr.open("POST", "http://localhost:5500/postData", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ data: "Reload" }));
}

// Clear and repopulate the table
function loadTable(data) {
    tableBody = document.getElementById("table").children[0] // Find the table body
    tableBody.innerHTML = "<tr><th>ID</th><th>Color</th></tr>" // Reset the table to just headers

    var jsonData = JSON.parse(data); // Turn the sent data to JSON
    jsonData.forEach(function(row) { // Use a for loop to turn all the rows into table rows
        var tr = document.createElement("tr"); // Create a new table row
        tableBody.appendChild(tr);

        var td = document.createElement("td"); // Create a new table data with the id
        td.innerHTML = row.exampleId;
        tr.appendChild(td);
        var td = document.createElement("td"); // Create a new table data with the color
        td.innerHTML = row.exampleColor;
        tr.appendChild(td);
    });
}