const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require("path");

class YoutubeDownloader {
    constructor() {}

    download(videoId) {
        return new Promise((resolve, reject) => {
            const stream = ytdl(`http://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' })
                .pipe(fs.createWriteStream(path.join(__dirname + `/../APIs/mp3_downloaded/${videoId}.mp3`)));
            stream.on('finish', () => resolve(`./mp3_downloaded/${videoId}.mp3`));
            stream.on('error', reject);
        });
    }
}
module.exports = YoutubeDownloader;
