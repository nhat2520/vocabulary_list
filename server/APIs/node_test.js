const { spawn } = require('child_process');
const videoId = 'Y681hXWwhQY'; // Thay thế 'your_video_id' bằng ID video YouTube của bạn

const python = spawn('python', ['-c', `
import sys
import youtube_transcriber

transcriber = youtube_transcriber.YoutubeTranscriber("${videoId}")
print(transcriber.transcribe())
`]);

python.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

python.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

python.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
