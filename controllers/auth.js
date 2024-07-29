const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
})



exports.register = (req,res) => {
    console.log(req.body);

    const {name,email,password} = req.body;

    db.query('SELECT email FROM users WHERE email = ?',[email],async (error,results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            console.log('user already exists')
            return res.status(400).json({ errors: { email: 'Email is already registered' } });
        }
        if(password.length<6){
            return res.status(400).json({ errors: { password: 'Password must contain 6 characters' } });
        }
        let hashedPassword = await bcrypt.hash(password,8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ? ', {name:name, email:email,password:hashedPassword},(error,results) => {
            if(error){
                console.log(error);
            }else{
                return res.status(200).json({ redirect: '/home' });
            }
        })
    } )
   
};

exports.login = (req,res) => {
    const { email , password} = req.body;
    db.query('SELECT * FROM users WHERE email = ?',[email],async (error,results) => {
        if(error){
            console.log(error);
            return res.status(500).json({ message: 'Server error' });
        }
        if(results.length === 0 ){
            return res.status(400).json({ errors: { email: 'Email is not registered' } });
        }
        try{
            const hashedPassword = results[0].password;
            const auth = await bcrypt.compare(password,hashedPassword);
            if(auth){
                return res.redirect('/home')
            } else {
                return res.status(400).json({ errors: { password: 'Wrong password' } });
            }
        }
        catch(err){
            console.log(err);
            return res.status(500).send("Server error");
        }
    })

}