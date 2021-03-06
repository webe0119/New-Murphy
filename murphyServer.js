// Requires
var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var path = require('path');
var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var mime = require('mime-types');

// Our Port
var port = 8005;

var public_dir = path.join(__dirname, 'public');

// Database
var db = new sqlite3.Database(path.join(__dirname, 'db', 'newMurphy.sqlite3'), (err) => {
    if (err) {
        console.log('Error opening newMurphy.sqlite3 database');
    }
    else {
        console.log('Now connected to newMurphy.sqlite3 database!');
    }
});

// Server 
var server = http.createServer(function(req, res) {
    var req_url = url.parse(req.url);
    
    var filename = req_url.pathname.substring(1);
    if (filename === "") {
            filename = "index.html";
    }

    // Check Database
    if (filename === "search.json")
    {

    }
    // GET Requests
    else if (req.method === "GET")
    {
        fs.readFile(path.join(public_dir, filename), (err, data) => {
            if (err){
                res.writeHead(404,{'Content-Type':'text/plain'});
                res.write('File Not Found');
                res.end();
            }
            else{
                var mime_type = mime.lookup(filename) || 'text/plain';
                res.writeHead(200, {'Content-Type': mime_type});
                res.write(data);
                res.end();
            }
        });
    }
    // POST Requests
    else if (req.method === "POST")
    {
        // Check Login
        if (filename ==="login")
        {
            var form = new multiparty.Form();
            form.parse(req, (err, fields, files) => {
                console.log(fields);
                console.log(files);
                var user = fields[0];
                var pass = fields[1];
                res.writeHead(200, {'Content-Type':'text/plain'});
                res.redirect('search.html');
                res.end();
            });
        }
        else
        {
            res.writeHead(500, {'Content-Type':'text/plain'});
            res.write("POST Error");
            res.end();
        }
    }
   else
   {
       var mime_type = mime.lookup(filename) || 'text/plain';
       res.writeHead(500, {'Content-Type': mime_type});
       res.write("Unknown Server Error");
       res.end();
   }
                               
});
console.log("Now listening on Port " + port);
server.listen(port, '0.0.0.0');
