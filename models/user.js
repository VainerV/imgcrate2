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

    picture: {
      type: String,
      ref: 'Picture'
    },

    email: {
      type: String, 
      require: true, 
      unique: true, 
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
      userName: {type: String, require: true},
      password: {type: String, require: true},
   
});

  
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
      email: this.email
    };
  };
  

const User = mongoose.model('User', userSchema);
module.exports = User