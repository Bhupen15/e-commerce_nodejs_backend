const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

//     name:{
//         type:String,
//     },
//     email:String,
//     password:String
// },{
//     timestamps:true,

     name: String,
     email: String,
     password: String,


 });

const User= mongoose.model("Users", userSchema);
module.exports = User;