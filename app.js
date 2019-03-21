const express=require('express');
var router = express.Router();
var login=require('./routes/login.js');
const app=express();

app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use('',login);
app.listen(3000,()=>{
});