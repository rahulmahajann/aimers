const path = require('path');

const express = require('express');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const fast2sms = require('fast-two-sms');

const db = require('./db/connection');

const Register = require('./models/register');
const Transaction = require('./models/transaction');
const Otp = require('./models/otp');

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

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

    const userAccountNo = await Transaction.findOne({fromaccount: senderAccountNo, toaccount: recieverAccountNo});


    res.render('confirmDetails',{
        senderAccountNo: userAccountNo.fromaccount,
        recieverAccNo: userAccountNo.toaccount,
        amountPaid: userAccountNo.amount,
    });
});

app.post('/otpvalidation', async (req, res) => {
    // console.log(req.body.senderacc);

    const senderAccNo = req.body.senderacc;

    const userDetails = await Register.findOne({acc_no: senderAccNo});

    // console.log(userDetails.phoneno);

    const senderOtp = Math.floor((Math.random()*10000000)+1);

    const otpDetails = new Otp({
        acc_no: senderAccNo,
        otp: senderOtp
    });

    const otpSummary = await otpDetails.save();

    var params = {
        authorization: process.env.SMS,
        message: `your otp is -> ${senderOtp}`,
        numbers: ['9625281237', '9868636253'] 
    }

                // fast2sms.sendMessage(params);

    // res.send('hello otp sent');

    res.render('otp',{
        phoneNo: userDetails.phoneno
    })
});

app.post('/auth', async (req, res) => {
    const phoneVerify = req.body.phoneno;
    const userOtp = req.body.otpVerify;
    // console.log(phoneVerify);

    const accData = await Register.findOne({phoneno: phoneVerify});
    const accNo = accData.acc_no;
    // console.log(accNo);

    const otpData = await Otp.findOne({acc_no: accNo});

    const otp = otpData.otp;

    console.log(otp, userOtp);

    if(otp==userOtp){
        res.send('welcome to face detection');
    }else{
        res.redirect('/');
    }   

});

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
});