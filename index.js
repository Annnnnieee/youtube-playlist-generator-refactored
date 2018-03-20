const authorize = require('./Authorization');
const requestGenerator = require('./request-generator');
const google = require('googleapis');
const Song = require('./song');
authorize().then(start);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/album');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("db connection successful");
});

async function start(auth) {
    for (let year = 1950; year < 2016; year += 5) {
        const songs = await Song.find({ year: year }).limit(4)
        for (const song of songs) {
            await processSongs(auth, song.artist + " - " + song.name);
            console.log("added: " + song.artist + " - " + song.name)
        }
    }
}

function processSongs(auth, query) {
    const request = requestGenerator.createSearchRequest(auth, query);
    const service = google.youtube('v3');
    return new Promise((resolve, reject) => {
        service.search.list(request, (err, response) => {
            err ? reject(err)
                : addSongToPlaylist(auth, response.data.items[0].id.videoId)
                    .then(resolve)
                    .catch(reject)
        });
    });
}

function addSongToPlaylist(auth, videoId) {
    const request = requestGenerator.createPlaylistInsertRequest(auth, videoId)
    const service = google.youtube('v3');
    return new Promise((resolve, reject) => {
        service.playlistItems.insert(request, (err, response) => {
            err ? reject(err)
                : resolve(response)
        })
    })
}