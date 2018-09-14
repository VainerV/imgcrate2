//Model for pictures
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const pictureSchema = mongoose.Schema(
    { 
        url: String,
        comment: String,
});



pictureSchema.methods.serialize = function() {
    return {
        id: this._id,
        url: this.comment,
        comment: this.comment
    };
  };

const Picture = mongoose.model('Picture', Picture);
module.exports = CommentPost;