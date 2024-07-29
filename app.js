const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv")
const path = require("path");

dotenv.config({path:'./.env'})

const app = express();
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/css",express.static(__dirname + "/public/css"))
app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
})
db.connect( (error) => {
    if(error){
        console.log("while connection")
        console.log(error)
    }else{
        console.log("mysql connected successfullly")
    }
})


app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(4000)