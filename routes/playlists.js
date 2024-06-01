const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');
const Song = require('../models/song');

// Lấy danh sách tất cả các playlist
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('songs');
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo mới một playlist với dữ liệu mẫu
router.post('/sample', async (req, res) => {
  try {
    // Lấy ID của bài hát từ cơ sở dữ liệu
    const song = await Song.findOne({ title: "Em xinh" });

    const playlist = new Playlist({
      title: "Sample Playlist",
      songs: [song._id], // Sử dụng ID của bài hát
      imageUrl: "http://example.com/playlist-cover.jpg"
    });

    const newPlaylist = await playlist.save();
    res.status(201).json(newPlaylist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Tạo mới một playlist
router.post('/', async (req, res) => {
  const playlist = new Playlist({
    title: req.body.title,
    songs: req.body.songs, // Array of song IDs
    imageUrl: req.body.imageUrl
  });

  try {
    const newPlaylist = await playlist.save();
    res.status(201).json(newPlaylist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy một playlist theo ID
router.get('/:id', getPlaylist, (req, res) => {
  res.json(res.playlist);
});

// Cập nhật một playlist
router.patch('/:id', getPlaylist, async (req, res) => {
  if (req.body.title != null) {
    res.playlist.title = req.body.title;
  }
  if (req.body.songs != null) {
    res.playlist.songs = req.body.songs;
  }
  if (req.body.imageUrl != null) {
    res.playlist.imageUrl = req.body.imageUrl;
  }
  try {
    const updatedPlaylist = await res.playlist.save();
    res.json(updatedPlaylist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa một playlist
router.delete('/:id', getPlaylist, async (req, res) => {
  try {
    await res.playlist.remove();
    res.json({ message: 'Deleted Playlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getPlaylist(req, res, next) {
  let playlist;
  try {
    playlist = await Playlist.findById(req.params.id).populate('songs');
    if (playlist == null) {
      return res.status(404).json({ message: 'Cannot find playlist' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.playlist = playlist;
  next();
}

module.exports = router;
