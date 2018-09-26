//Model for pictures
'use strict';
//let comments = require('./comment');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const pictureSchema = mongoose.Schema(
    { 
        url: String,
        comment: String,
       // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});



pictureSchema.methods.serialize = function() {
    return {
        id: this._id,
        url: this.url,
       // user: this.user,
      
    };
  };

const Picture = mongoose.model('Picture', pictureSchema);
module.exports = Picture;