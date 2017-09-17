
// library
const express = require('express');
const Http = require('http');
const bodyParser = require('body-parser');

// modules
const socket = require('./socket');

const app = express();
const http = Http.Server(app);

app.use(express.static('view'));
app.use(bodyParser.urlencoded({ extended: false }));

socket(http);

http.listen(17920, () => {
  console.log('server on');
});
