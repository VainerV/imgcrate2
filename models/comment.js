//Model for commentpost
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const commentSchema = mongoose.Schema(
    { 
        comment: String,
        pictureId: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});


commentSchema.pre('find', function(){
    this.populate('user');
})

commentSchema.pre('findOne', function(){
    this.populate('user');
})


commentSchema.methods.serialize = function() {
    return {
        id: this._id,
        comment: this.comment,
        pictureId: this.pictureId,
        user: this.user
    };
  };

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;