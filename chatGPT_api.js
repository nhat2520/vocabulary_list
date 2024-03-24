const OpenAI = require("openai");
const fs = require('fs');

/**
 * Class representing a chat with OpenAI.
 */
class OpenAIChat {
  /**
   * Create a chat.
   * @param {string} apiKey - The API key for OpenAI.
   * @param {string} prompt - The system prompt.
   * @param {string} input - The user input.
   */
  constructor(apiKey, prompt, input) {
    this.apiKey = apiKey;
    this.prompt = prompt;
    this.input = input;
    this.openai = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  /**
   * Send a chat message and save the response to a file.
   * @async
   */
  async chat() {
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: "system", content: this.prompt }, { role: "user", content: this.input }],
      model: "gpt-3.5-turbo",
    });

    // Save the result to output.json
    fs.writeFileSync('output.json', JSON.stringify(completion.choices[0], null, 2));

    console.log(completion.choices[0]);
  }
}

const apiKey = fs.readFileSync('apiKey.txt', 'utf8').trim();
const prompt = fs.readFileSync('prompt.txt', 'utf8').trim();
const input = fs.readFileSync('input.txt', 'utf8').trim();

// Create a new chat with OpenAI
const chat = new OpenAIChat(apiKey, prompt, input);
// Start the chat
chat.chat();
