const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const songsRouter = require('./routes/songs');
const playlistsRouter = require('./routes/playlists');
// const authRouter = require('./routes/auth');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Kết nối MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/songs', songsRouter);
app.use('/playlists', playlistsRouter);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
