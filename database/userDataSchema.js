var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserDataSchema=new Schema({
    name:String,
    password:String,
    email:String,
    caldata:[{month:String,day:String,events:[]}],
});

var UserData=mongoose.model('UserDataSchema',UserDataSchema);
module.exports=UserData;