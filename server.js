var express = require('express');
var passport = require('passport');
var secret = require('./secret');
var server = express.createServer();

server.configure(function() {
  server.use(express.logger());
  server.use(express.cookieParser());
  server.use(express.bodyParser());
  server.use(express.static('development'));
  server.use(express.session({ secret: secret.secret }));
  server.use(passport.initialize());
  server.use(passport.session());
  server.use(server.router);
});
server.listen(3000);
