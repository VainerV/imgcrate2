//Model for the user
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;



// User schema
const userSchema = mongoose.Schema({
    author: {
        firstName: String,
        lastName: String,
        email: String,
    },
    uniqueUserName: {
        type: 'string',
        
    }
});


userSchema.pre('find', function(next) {
    this.populate('author');
    next();
  });
  
  userSchema.pre('findOne', function(next) {
    this.populate('author');
    next();
  });
  
  userSchema.virtual('name').get(function() {
    if(this.author) {
      return `${this.user.firstName} ${this.user.lastName}`.trim();
   } 
    
  });
  
  
  userSchema.methods.serialize = function() {
    return {
      id: this._id,
      user: this.author,
      userName: this.uniqueUserName,
    };
  };
  

const User = mongoose.model('User', userSchema);
module.exports = { User };