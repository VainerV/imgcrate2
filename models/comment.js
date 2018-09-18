//Model for commentpost
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const commentSchema = mongoose.Schema(
    { 
        comment: String,
});



commentSchema.methods.serialize = function() {
    return {
        id: this._id,
       comment: this.comment
    };
  };

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;