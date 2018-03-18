var mongoose = require("mongoose");

let songSchema = mongoose.Schema({
  artist: String,
  name: String,
  year: Number
});

const Song = mongoose.model('song', songSchema);

module.exports = Song;