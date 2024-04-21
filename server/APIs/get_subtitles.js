const { getSubtitles } = require('youtube-captions-scraper');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const YoutubeTranscriber = require('./youtube_transcriber.js')

/**
 * Class to fetch YouTube video captions.
 */
class YouTubeCaptions {
  /**
   * @param {string} youtubeUrl - The YouTube video URL.
   * @param {string} lang - The language code for the captions.
   */
  constructor(youtubeUrl, lang) {
    if (!this.isValidYoutubeUrl(youtubeUrl)) {
      throw new Error('The input URL is not a valid YouTube URL.');
    }

    this.videoID = this.getVideoIdFromUrl(youtubeUrl);
    this.lang = lang;
    this.apiKey = fs.readFileSync('apiKey.txt', 'utf8').trim();
  }

  /**
   * Checks if the input URL is a valid YouTube URL.
   * @param {string} youtubeUrl - The YouTube video URL.
   * @returns {boolean} - Returns true if the URL is a valid YouTube URL, false otherwise.
   */
  isValidYoutubeUrl(youtubeUrl) {
    const parsedUrl = url.parse(youtubeUrl);
    return parsedUrl.hostname === 'www.youtube.com' && parsedUrl.pathname === '/watch' && !!querystring.parse(parsedUrl.query).v;
  }

  /**
   * Extracts the video ID from the YouTube URL.
   * @param {string} youtubeUrl - The YouTube video URL.
   * @returns {string} - Returns the video ID.
   */
  getVideoIdFromUrl(youtubeUrl) {
    const parsedUrl = url.parse(youtubeUrl);
    const parsedQuery = querystring.parse(parsedUrl.query);
    return parsedQuery.v;
  }

  /**
   * Fetches the captions of the YouTube video.
   */
  fetch() {
    return getSubtitles({
      videoID: this.videoID,
      lang: this.lang
    }).then(captions => {
      if (captions.length === 0) {
        console.log('This video does not have captions.');
        const transcriber = new YoutubeTranscriber(this.videoID, this.apiKey);
        return transcriber.transcribe();
      }
  
      // Remove irrelevant parts
      captions = captions.filter(item => item.text !== '[Music]');
  
      // Concatenate the text parts
      const text = captions.map(item => item.text).join(' ');
      return text;
    }).catch(error => {
      const transcriber = new YoutubeTranscriber(this.videoID, this.apiKey);
      return transcriber.transcribe();
    });
  }
    
}  

// Using the class
const youtubeUrl = 'https://www.youtube.com/watch?v=BN9sGR948RM';
try {
  const captions = new YouTubeCaptions(youtubeUrl, 'en');
  captions.fetch().then(transcript => {
    console.log(transcript);
  });
} catch (error) {
  console.error(error.message);
}
