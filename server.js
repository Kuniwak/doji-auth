var express = require('express');
var server = express();

server.use(express.logger());
server.use(express.static('output'));
server.listen(3000);
