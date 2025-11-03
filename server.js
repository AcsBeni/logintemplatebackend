const express = require('express');
var cors = require('cors');
const tables = require('./moduls/tables');
const app = express();
const logger = require("./utils/logger")

// Middleware-ek
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', tables);



app.listen(process.env.PORT, () => {
    
    logger.info(`Server listening on ${process.env.PORT}`);//${process.env.PORT}
});

/*
DBHOST=localhost
DBUSER=root
DBPASS=
DBNAME=2025_katicabufe
DEBUG=1
npm install crypto-js
.env
PORT=3000 */

/**
 * 
 *   http://localhost:3000/categoies/54
 */