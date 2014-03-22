require('node-jsx').install({extension: '.jsx'});
global.React = require('react/addons');

var http = require('http');

var express = require('express');
var redis = require('redis');

var api = require('./app/server/api');
var web = require('./app/server/web');

var PORT = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var db = redis.createClient(6379, 'localhost', {retry_max_delay: 10 * 1000});

// TODO: figure out why errors in express, etc. are triggering this event on db
db.on('error', function(e) {});

db.on('end', function() {
  app.set('dbConnected', false);
});

db.on('connect', function() {
  app.set('dbConnected', true);
});

app.set('root', __dirname);
app.set('uploadDir', __dirname + '/images-upload');
app.set('view engine', 'ejs');

if (app.get('env') === 'production') app.use(express.logger());
app.use(express.compress());
app.use(express.static(app.get('root') + '/public'));
if (app.get('env') === 'development') app.use(express.logger('dev'));
app.use(app.router);
if (app.get('env') === 'development') app.use(express.errorHandler());

[api, web].forEach(function(extension) {
  extension(app, db);
});

server.listen(PORT, function() {
  console.log("Listening at http://localhost:" + PORT);
});
