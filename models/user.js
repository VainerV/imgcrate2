//Model for the user
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;



// User schema
const userSchema = mongoose.Schema({
  
    user: {
        firstName: String,
        lastName: String,
        
    },
    email: String,
    userName: {type: String, require: true},
    password: {type: String,require: true}
   
});


// userSchema.pre('find', function(next) {
//     this.populate('user');
//     next();
//   });
  
//   userSchema.pre('findOne', function(next) {
//     this.populate('user');
//     next();
//   });
  
  userSchema.virtual('name').get(function() {
    if(this.user) {
      //console.log(this)
      return `${this.user.firstName} ${this.user.lastName}`.trim();
   } 
    
  });
  
  
  userSchema.methods.serialize = function() {
    return {
      id: this._id,
      name: this.name,
      userName: this.userName,
      email:this.email
    };
  };
  

const User = mongoose.model('User', userSchema);
module.exports = User