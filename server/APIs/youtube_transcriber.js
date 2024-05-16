const OpenAI = require("openai");
const fs = require('fs');
const YoutubeDownloader = require('./download_mp3_file.js');
const path = require("path");

class YoutubeTranscriber {
  constructor(videoId, apiKey) {
    this.videoId = videoId;
    this.apiKey = apiKey;
    this.openai = new OpenAI({ apiKey: this.apiKey });
  }

  async transcribe() {
    // Download the video as an mp3 file
    const downloader = new YoutubeDownloader();
    const mp3FilePath = await downloader.download(this.videoId);

    // Transcribe the mp3 file
    const transcription = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(path.join(__dirname, mp3FilePath)),
      model: "whisper-1",
    });

    return transcription.text;
  }
}

// Replace 'YOUR_VIDEO_ID' with the ID of the YouTube video you want to transcribe
// Replace 'apiKey.txt' with the path to your API key file
// const transcriber = new YoutubeTranscriber('BN9sGR948RM', 'apiKey.txt');
// transcriber.transcribe().then(console.log);

module.exports = YoutubeTranscriber;