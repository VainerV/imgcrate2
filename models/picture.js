//Model for pictures

'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const pictureSchema = mongoose.Schema(
    { 
        url: String,
        description: String,
        comment: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
       
});

pictureSchema.pre('find', function(){
    this.populate('comment');
    this.populate('user');
})

pictureSchema.pre('findOne', function(){
    this.populate('comment');
    this.populate('user');

})

pictureSchema.methods.serialize = function() {
    return {
        id: this._id,
        url: this.url,
        description: this.description,
        comments: this.comment,
        user: this.user,
      
    };
  };

const Picture = mongoose.model('Picture', pictureSchema);
module.exports = Picture;