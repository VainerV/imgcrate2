//Model for commentpost
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const commentSchema = mongoose.Schema(
    { 
        comment: String,
        pictureId: String,
        // user ID   //{ type: mongoose.Schema.Types.ObjectId, ref: 'Picture' },
});



commentSchema.methods.serialize = function() {
    return {
        id: this._id,
        comment: this.comment,
        pictureId: this.pictureId,
    };
  };

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;