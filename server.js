const express = require('express');
const app = express();
const PORT = 3000
const cookieparser = require('cookie-parser');


app.use(express.json());
app.use(express.static('public'));


app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));


const registrar = require('./security/register');
app.use('/registrar', registrar);
 
const loginR = require('./security/login');
app.use('/loginR', loginR);

const logoutjs = require('./helpers/logout');
app.use('/logoutjs', logoutjs);

const total = require('./helpers/total');
app.use('/total', total);

const sieves = require('./rules/sieves');
app.use('/sieve', sieves);


const university = require('./rules/university');
app.use('/uniform', university);


const resetpassword = require('./helpers/sendemail');
app.use('/resetpassword',resetpassword);


app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
    
})
