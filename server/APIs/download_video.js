/**
 * This script downloads a YouTube video as an MP3 file using the YoutubeDownloader class.
 *
 * @module Download YouTube Video
 */

// Import the YoutubeDownloader class from the download_mp3_file module
const YoutubeDownloader = require('./download_mp3_file');

// Create a new instance of the YoutubeDownloader class
const downloader = new YoutubeDownloader();

// Get the YouTube video ID from the command line arguments
const videoId = process.argv[2]; 

/**
 * Use the download method of the YoutubeDownloader class to download the YouTube video as an MP3 file.
 * The download method returns a promise that resolves to the path of the downloaded MP3 file.
 * If there is an error during the download, the promise is rejected and the error is logged to the console.
 */
downloader.download(videoId)
  .then(filePath => console.log(filePath))
  .catch(error => console.error(error));
