var express = require('express');
var path=require('path');
var bodyParser=require('body-parser');
var router = express.Router();
var mongoose=require('mongoose');
var mongojs=require('mongojs');
var db=mongojs('mongodb://localhost:27017/Users');
var userEntry=require('../database/userDataSchema');
//var session = require('express-session');

var app = express();

//initialize session
/*

var sess;
app.get('/',function(req,res){
  sess=req.session;
  sess.email;
});*/



var isAuthenticated=false;
var useremail="";



//set up database connection
mongoose.connect('mongodb://localhost:27017/Users',{ useNewUrlParser: true });
mongoose.connection.once('open',function(){
  console.log("connected");
});
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.render(path.resolve('views/login'));
  }); 
 
//check user in database
function inDatabase(email,password,name){
    if(name!=undefined)
    {
      return new Promise(resolve => {db.userdataschemas.find({email:email}).toArray(function(err, result) {
        if (err) throw err;
        console.log("result is"+ result[0]); 
        if(result[0]!=undefined)
          resolve(true);
        else 
          resolve(false);  
      });
    });
    }
    else
    {
     return new Promise(resolve =>{db.userdataschemas.find({email:email}).toArray(function(err, result) {
        if (err) throw err;
        if(result[0]!=undefined)
        {
          if(result[0].password==password)
          {
            isAuthenticated=true;
            useremail=email;
            resolve(true);
          }
          else
          {
           
          isAuthenticated=false;
          useremail=null;
          resolve(false);
          }
        } 
        else
        {
          isAuthenticated=false;
          useremail=null;
          resolve(false);
        }
      });
    });
    }
}
router.use('/calander',function(req,res,next){
  if(isAuthenticated==true)
  {
    console.log("logged in")
    next();
  }
  else
  {
  console.log("not looged in");
  res.redirect('/');
  }  
});
router.get('/calander',function(req,res,next){
  res.render(path.resolve('views/calander'),{person:useremail});
});
router.get('*',function(req,res){
  res.send("BE GONE!!!");
});

router.post('/', async function(req,res){
  var email=req.body.email;
  var password=req.body.password;
  var user_name=req.body.user_name;
  if(req.body.user_name==undefined)                      //login 
  {
    var checkInDatabase=await inDatabase(email,password);
    console.log("check in "+checkInDatabase);
    if(checkInDatabase==true)
    {
    res.set('Content-Type', 'text/html');
  // res.render(path.resolve('views/calander'),{person:email});
      res.redirect('/calander');
    }
    else
    {
      res.redirect('/');
    }
  }
  else                                                  //register
  {
    var alreadyInDatabase = await inDatabase(email,password,user_name);
    console.log("function "+alreadyInDatabase);
    if(alreadyInDatabase!=true)
    {
      var newUser = new userEntry({
        name:user_name,
        password:password,
        email:email,
        caldata:[{month:"jan",day:"1",events:[]}]
      });
      newUser.save().then(function(){
        console.log("success");
      });
    }
  else
  {
    console.log("already registerd");
  }
  }  
  });


  router.post("/calander",function(req,res){

  });
module.exports=router;
