//Model for pictures
'use strict';
//let commentSchema = require('./comment');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const pictureSchema = mongoose.Schema(
    { 
        url: String,
        description: String,
         comment: {
            type: String,
            ref: './comment/Comment'
        }
        // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
       // comment: { type: mongoose.Schema.Types.ObjectId, ref: './commnet/Comment' }
});



pictureSchema.methods.serialize = function() {
    return {
        id: this._id,
        url: this.url,
        description: this.description,
        comments: "user comments "//[this.comment]
       // user: this.user,
      
    };
  };

const Picture = mongoose.model('Picture', pictureSchema);
module.exports = Picture;