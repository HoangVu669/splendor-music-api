const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  imageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Playlist', playlistSchema);
