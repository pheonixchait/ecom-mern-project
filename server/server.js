const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const { readdirSync } = require('fs')

//commented below line because we found a dynamic way of auto importing required module, which is useful when there are many route files to import
//const authRoutes = require('./Routes/auth')

const { auth } = require('firebase-admin')

//app
//express is a function which execites and creates a server
const app = express() //here express server is creating a server

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => console.log("DB CONNECTED"))
    .catch((err) => console.log("DB CONNECTION ERROR: ", err))

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//Route middleware
//app.use('/api', authRoutes);
readdirSync('./Routes').map((r) => app.use('/api', require('./Routes/' + r)));

//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log('server is running on port ', port));
