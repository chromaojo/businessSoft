const express = require('express');
const path = require('path');
const app = express();
const port = 8088;
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const {AvoidIndex,UserLoggin, AdminRoleBased} = require('./server/auth/auth')



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(cookieParser());



app.use('/db', require('./server/models/tables'));
app.use('', require('./server/routes/pages'));
app.use('/user', UserLoggin, require('./server/routes/customer'));
app.use('/admin', AdminRoleBased, require('./server/routes/admin'));

app.route('*', (req, res)=>{
    res.render('page-error')
})

app.listen(port, ()=>{
    console.log(`App Running on ${port}`);
})