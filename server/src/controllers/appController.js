let {
  saveDefineWord,
  saveConversation,
  getAllKeyword,
  getAllConversation,
  deleteConversation,
  deleteDefineKeyword,
} = require("../services/appService");
import { OpenAIChat } from "../../APIs/chatGPT_api.js";
import { YouTubeCaptions } from "../../APIs/get_subtitles.js";

const fs = require("fs");
let handleSaveDefineWord = async (req, res) => {
  let data = req.body;
  let message = await saveDefineWord(data);
  return res.status(200).json(message);
};

let handleSaveConversation = async (req, res) => {
  let data = req.body;
  let message = await saveConversation(data);
  return res.status(200).json(message);
};

let handleGetAllKeywords = async (req, res) => {
  let id = req.query.id;
  let data = await getAllKeyword(id);
  return res.status(200).json(data);
};

let handleGetAllConversation = async (req, res) => {
  let id = req.query.id;
  let data = await getAllConversation(id);
  return res.status(200).json(data);
};

let handleDeleteConversation = async (req, res) => {
  let id = req.body.id;
  let message = await deleteConversation(id);
  return res.status(200).json(message);
};

let handleDeleteDefineWord = async (req, res) => {
  let id = req.body.id;
  let message = await deleteDefineKeyword(id);
  return res.status(200).json(message);
};

let handleChatGPTtext = async (req, res) => {
  let text = req.body.text;
  fs.writeFileSync("./APIs/input.txt", text, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
  await chatGPTapi();
  const output = require("../../APIs/output.json");
  return res.status(200).json({
    errCode: 0,
    errMessage: "Oke roi",
    output,
  });
};

let handleChatGPTsubtitle = async (req, res) => {
  let link = req.body.link;
  let text = await getSubtitlesFromLink(link);
  fs.writeFileSync("./APIs/input.txt", text, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });

  await chatGPTapi();
  const output = require("../../APIs/output.json");
  return res.status(200).json({
    errCode: 0,
    errMessage: "Oke roi",
    output,
  });
};

//file này chưa sửa
let handleChatGPTpdf = async (req, res) => {
    let link = req.body.link;
    // const apiKey = fs.readFileSync('apiKey.txt', 'utf8').trim();
    // const prompt = fs.readFileSync('prompt.txt', 'utf8').trim();
    // const input = fs.readFileSync('input.txt', 'utf8').trim();
    // const test = await new OpenAIChat(apiKey, prompt, input);
    // test.chat();
    const youtubeUrl = "https://www.youtube.com/watch?v=DYFOtb70eEI";
    let text = "";
    try {
      const captions = new YouTubeCaptions(link, "en");
      text = await captions.fetch();
      console.log(text);
    } catch (error) {
      console.error(error.message);
    }
    return res.status(200).json({
      errCode: 0,
      errMessage: "Oke roi",
      text,
    });
};




let chatGPTapi = async() => {
    const apiKey = fs.readFileSync("./APIs/apiKey.txt", "utf8").trim();
    const prompt = fs.readFileSync("./APIs/prompt.txt", "utf8").trim();
    const input = fs.readFileSync("./APIs/input.txt", "utf8").trim();
    const test = await new OpenAIChat(apiKey, prompt, input);
    await test.chat();
}

let getSubtitlesFromLink = async (link) => {
  let text = "";
  try {
    const captions = new YouTubeCaptions(link, "en");
    text = await captions.fetch();
    return text;
  } catch (error) {
    console.error(error.message);
  }
  return text;
};


module.exports = {
  handleSaveDefineWord,
  handleSaveConversation,
  handleGetAllKeywords,
  handleGetAllConversation,
  handleDeleteConversation,
  handleDeleteDefineWord,
  handleChatGPTtext,
  handleChatGPTsubtitle,
  handleChatGPTpdf,
};
