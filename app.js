require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const router = require('./routes/routes');

const connecttoDB = require('./db/db');

connecttoDB();

//middleware
app.use(express.json());
app.use('/auth', router);

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});
