
const express = require('express');
const routes = require('./routes');
var cors = require('cors');
const app = express();
var amqp = require('amqplib/callback_api');

app.use(cors());
app.use(express.json());
app.use(routes);

// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
    message: err.message,
    });

});


app.listen(3000,() => console.log('Server is running on port 3000'));