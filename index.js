require('dotenv').config();
const express = require('express');
let bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let globalVariable = []

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const {url} = req.body;
  const regexUrl = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/gm
  console.log({url})
  const urlValidation = url ? url.match(regexUrl) : false;

  if (urlValidation) {
    const oriUrl = {original_url: url, short_url: globalVariable.length + 1}
    globalVariable.push(oriUrl)
    res.json(oriUrl)
  } else {
    res.json({error: 'invalid url'})
  }
})

app.get('/api/shorturl/:id', function(req, res) {
  const id = req.params.id

  res.redirect(301, globalVariable[Number(id) - 1].original_url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
