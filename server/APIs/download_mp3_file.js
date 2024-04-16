const fs = require('fs');
const ytdl = require('ytdl-core');

class YoutubeDownloader {
    constructor() {}

    download(videoId) {
        return new Promise((resolve, reject) => {
            const stream = ytdl(`http://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' })
                .pipe(fs.createWriteStream(`./mp3_downloaded/${videoId}.mp3`));

            stream.on('finish', () => resolve(`./mp3_downloaded/${videoId}.mp3`));
            stream.on('error', reject);
        });
    }
}

module.exports = YoutubeDownloader;
