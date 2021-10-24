const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    post_title: {
      type: String,
      required: true
    },
    post_image:{
      type: String,
      required: true
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users'
    },
    author_name: {
      type: String,
      ref: 'Users',
    },
    liked_id: [
      {
        id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
      }
    }
  ],
    comments: {
      comment:{
        _id: {
           type: mongoose.Schema.Types.ObjectId, 
           auto: true 
          },
      comment_content: {
        type: String
      },
      author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },
      author_id_ref:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      liked_by: [{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
          required: true
        }
      }],
      likes: {
        type: mongoose.Schema.Types.Number,
        default: 0
      },
      timestamp: {
        type: Date
      }
    },  },
  }); 

  module.exports = mongoose.model('Posts',PostSchema);

  