const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/registers');

const db = mongoose.connection;

db.on('error', () => {
    console.log('error in connection with db');
})

db.once('open', () => {
    console.log('connected to db');
});

app.get('/', (req, res)=> {
    return res.redirect('signUp.html');
});

app.get('/login', (req, res) => {
    return res.redirect('login.html')
});

app.post('/login', async (req, res) => {
    try{
        const login_email = req.body.email;
        const password = req.body.password;     
        
        // console.log(login_email, password);

        const useremail = await db.collection('users').findOne({email: login_email});

        if(bcrypt.compareSync(req.body.password,useremail.password)){
            res.status(201).send('logged in');
            console.log("logged in");
        }else{
            res.status(400).send('sorry u have entered wrong email or password');
        }
    }catch(error){
        res.status(400).send('invalid details');
    }
});

app.post('/signup', (req, res) => {
    const name = req.body.name;
    const email = req.body.email; 
    const password = bcrypt.hashSync(req.body.password,8);
    const phoneno = req.body.phoneno;
    const nominee = req.body.nominee

    console.log(name,email,password);
    
    var data = {
        'name': name,
        'email': email,
        'phoneno': phoneno,
        'nomniee': nominee,
        'password': password
    }

    db.collection('users').insertOne(data, (err, collection) => {
        if(err){
            throw err;
        }else{
            console.log('data inserted');
        }
    });
    
    return res.redirect('succes.html')

});

app.listen(PORT, ()=> {
    console.log(`App running on ${PORT}`);
});