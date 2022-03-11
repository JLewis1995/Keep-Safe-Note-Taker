const express = require('express');
const api = require('./routes/api');
const html = require('./routes/html');
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// use routes
app.use('/api', api);
app.use('/', html);

// Listen for connections
app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`)
);