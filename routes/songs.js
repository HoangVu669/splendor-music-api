const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Song = require('../models/song');

// Cấu hình multer để lưu trữ file nhạc và ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;
        if (file.fieldname === 'url') {
            uploadPath = 'uploads/musics/';
        } else if (file.fieldname === 'coverurl') {
            uploadPath = 'uploads/images/';
        }

        // Kiểm tra và tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const query = req.query.q;
        let songs;
        if (query) {
            // Tìm kiếm bài hát theo tên
            songs = await Song.find({ title: new RegExp(query, 'i') });
        } else {
            // Lấy tất cả bài hát
            songs = await Song.find();
        }
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tạo mới một bài nhạc
router.post('/', upload.fields([{ name: 'url', maxCount: 1 }, { name: 'coverurl', maxCount: 1 }]), async (req, res) => {
    if (!req.files['url'] || !req.files['coverurl']) {
        return res.status(400).json({ message: 'Please upload both the song file and the cover image.' });
    }

    const song = new Song({
        title: req.body.title,
        description: req.body.description,
        url: req.files['url'][0].path,
        coverurl: req.files['coverurl'][0].path
    });

    try {
        const newSong = await song.save();
        res.status(201).json(newSong);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
