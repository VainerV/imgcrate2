//Model for commentpost
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const commentSchema = mongoose.Schema(
    { 
        comment: String,
        picture: { type: mongoose.Schema.Types.ObjectId, ref: 'Picture' },
});



commentSchema.methods.serialize = function() {
    return {
        id: this._id,
        comment: this.comment,
        picture: this._id
    };
  };

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;