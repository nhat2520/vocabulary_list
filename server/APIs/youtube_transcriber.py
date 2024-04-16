"""
This script downloads a YouTube video as an MP3 file using the YoutubeDownloader class,
and then transcribes the audio to text using OpenAI's Speech-to-Text API.

Usage:
    python youtube_transcriber.py [youtube_video_id]

Dependencies:
    - openai: Install with `pip install openai`
    - Node.js: Download and install from https://nodejs.org/
    - youtube-dl: Install with `npm install ytdl-core`
    - Python 3.6 or higher

Environment Variables:
    - OPENAI_API_KEY: Your OpenAI API key. This can be found on the OpenAI platform.

Input:
    - youtube_video_id: The ID of the YouTube video to download and transcribe. This is the string of characters
      that comes after "watch?v=" in a YouTube video URL.

Output:
    - The transcribed text is printed to the console.
"""

import os
import subprocess
from openai import OpenAI

class YoutubeTranscriber:
    """
    A class that encapsulates the functionality of downloading a YouTube video as an MP3 file
    and transcribing the audio to text.
    """

    def __init__(self, video_id):
        """
        Initializes a new instance of the YoutubeTranscriber class.

        Args:
            video_id (str): The ID of the YouTube video to download and transcribe.
        """
        self.video_id = video_id
        with open('apiKey.txt', 'r') as f:
            api_key = f.read().strip()
        os.environ["OPENAI_API_KEY"] = api_key

    def download_video(self):
        """
        Downloads the YouTube video as an MP3 file.

        Returns:
            str: The path of the downloaded MP3 file.
        """
        result = subprocess.run(['node', 'download_video.js', self.video_id], stdout=subprocess.PIPE)
        return result.stdout.decode('utf-8').strip()  # Return the path of the downloaded MP3 file

    def transcribe_audio_to_text(self, audio_file_path):
        """
        Transcribes the audio from the MP3 file to text using OpenAI's Speech-to-Text API.

        Args:
            audio_file_path (str): The path of the MP3 file to transcribe.

        Returns:
            str: The transcribed text.
        """
        # Initialize an OpenAI client
        client = OpenAI()

        # Open the MP3 file in binary mode
        with open(audio_file_path, 'rb') as audio_file:
            # Create a transcription from the audio file
            transcription = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file
            )

        # Return the transcribed text
        return transcription.text

    def transcribe(self):
        """
        Downloads the YouTube video and transcribes the audio to text.

        Returns:
            str: The transcribed text.
        """
        audio_file_path = self.download_video()
        return self.transcribe_audio_to_text(audio_file_path)
