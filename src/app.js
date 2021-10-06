const path = require('path');

const express = require('express');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');

const db = require('./db/connection');
const Register = require('./models/register');
const Transaction = require('./models/transaction');

const app = express();
const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, '../public');
const templatePath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

// console.log(__dirname, staticPath);
app.use(express.urlencoded({extended:true}));
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set('views', templatePath);
hbs.registerPartials(partialPath);


app.get('/',(req, res) => {
    res.render('index');
});

app.get('/login', (req, res)=> {
    res.render('index')
});

app.get('/signup', (req, res) => {
    res.render('signUp');
});

app.post('/signup', async (req, res) => {
    try{
    
        const password = req.body.password;
        const confirmPassword = req.body.confirmpassword;

        if(password === confirmPassword){
            const data = new Register({
                'acc_no': req.body.accountNumber,
                'name': req.body.name,
                'email': req.body.email,
                'password': bcrypt.hashSync(password,8),
                'nominee': req.body.nominee,
                'phoneno': req.body.phoneno,
                'accountbalance': 1000000
            })

            const registeredData = await data.save();
            res.status(200).redirect('/login');
        }
        else{
            res.render('passwordnotmatched');
        }

    }catch(error){
        res.status(400).send(error);
    }

});

app.post('/transaction', async (req, res)=> {
    try{
        const login_email = req.body.email;
        const password = req.body.password;

        // console.log(login_email, password);

        const userEmail = await Register.findOne({email: login_email});

        if(bcrypt.compareSync(req.body.password,userEmail.password)){
            res.status(201).render('transactionDetails',{
                accountNumber: userEmail.acc_no,
                balance: userEmail.accountbalance
            });
        }else{
            res.status(400).send('sorry u have entered wrong email or password');
        }

    }catch(error){
        res.status(400).send('invalid details');
    }
});

app.post('/confirmdetails', async (req, res) => {
    const senderAccountNo = req.body.accountno;
    const recieverAccountNo = req.body.toaccountno;
    const amountTransfered = req.body.transferedamount;

    
    // console.log(senderAccountNo, recieverAccountNo, amountTransfered);
    
    const transactionSummary = new Transaction({
        'fromaccount': senderAccountNo,
        'toaccount': recieverAccountNo,
        'amount': amountTransfered
    });
    
    const transactionSummaryData = await transactionSummary.save();

    const userAccountNo = await Transaction.findOne({fromaccount: senderAccountNo});

    res.render('confirmDetails',{
        senderAccountNo: userAccountNo.fromaccount,
        recieverAccountNo: userAccountNo.toaccount,
        amountPaid: userAccountNo.amount,
    });
});

app.post('/otpvalidation', (req, res) => {
    res.send('otp generated');
});

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
});