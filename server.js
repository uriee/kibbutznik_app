// ./server.js
const express = require('express');
const userRoutes = require('./scr/routes/userRoutes');  // Update the path as needed
const userRoutes = require('./scr/routes/CommunitiyRoutes');  // Update the path as needed
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;  // Use the PORT environment variable, or 3000 if it's not set

// To parse JSON bodies
app.use(bodyParser.json());

// Use the userRoutes for all routes starting with /users
app.use('/users', userRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));