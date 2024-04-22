let {
  saveDefineWord,
  saveConversation,
  getAllKeyword,
  getAllConversation,
  deleteConversation,
  deleteDefineKeyword,
} = require("../services/appService");
import { json } from "sequelize";
import { OpenAIChat } from "../../APIs/chatGPT_api.js";
import { YouTubeCaptions } from "../../APIs/get_subtitles.js";
import { PdfReader } from "../../APIs/read_pdf.js";
const fs = require("fs");
const uploadDirectory = "./uploads";

let handleSaveDefineWord = async (keyword, defineword) => {
  let data = { keyWord: keyword, defineWord: defineword };
  let message = await saveDefineWord(data);
  return message;
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
  const jsonKeyValue = await chatGPTapi();
  return res.status(200).json({
    errCode: 0,
    errMessage: "Oke roi",
    keyValue: jsonKeyValue,
  });
};


let handleChatGPTsubtitle = async (req, res) => {
  let link = req.body.link;
  let text = await getSubtitlesFromLink(link);
  fs.writeFileSync("./APIs/input.txt", text, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
  const jsonKeyValue = await chatGPTapi();
  return res.status(200).json({
    errCode: 0,
    errMessage: "Oke roi",
    KeyValue: jsonKeyValue,
  });
};


let handleChatGPTpdf = async (req, res) => {
  const uploadedFile = req.file;
  const text = await uploadFilePdf(uploadedFile);
  fs.writeFileSync("./APIs/input.txt", text, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
  const jsonKeyValue = await chatGPTapi();
  return res.status(200).json({
    errCode: 0,
    errMessage: "Oke roi",
    jsonKeyValue,
  });
};


let chatGPTapi = async () => {
  const apiKey = fs.readFileSync("./APIs/apiKey.txt", "utf8").trim();
  const prompt = fs.readFileSync("./APIs/prompt.txt", "utf8").trim();
  const input = fs.readFileSync("./APIs/input.txt", "utf8").trim();
  const test = await new OpenAIChat(apiKey, prompt, input);
  await test.chat();

  const output = require("../../APIs/output.json");
  const content = output.message.content;
  const jsonKeyValue = splitKeyValue(content);

  //lưu defineword liên quan
  let x;
  for (x in jsonKeyValue) {
    await handleSaveDefineWord(x, jsonKeyValue[x]);
    console.log(jsonKeyValue[x]);
  }
  return jsonKeyValue;
};


let getSubtitlesFromLink = async (link) => {
  let text = "";
  try {
    const captions = new YouTubeCaptions(link, "en");
    await captions.fetch().then((transcript) => {
      console.log(transcript);
      text = transcript;
    });
  } catch (error) {
    console.error(error.message);
  }
  return text;
};


//chuyển đoạn text chứa key value thành json
let splitKeyValue = (textChatgpt) => {
  const text = textChatgpt;
  const myArrText = text.split(/(?:\n|\n\n])+/);
  console.log(myArrText);
  const data = {};
  myArrText.forEach(function (element) {
    const splitText = element.split(":");
    data[splitText[0]] = splitText[1];
  });
  return data;
};


//upload file pdf và lấy ra text
const uploadFilePdf = async (uploadedFile) => {
  let text = "";
  try {
    // Write the file to the upload directory
    const fileName = `${uploadedFile.originalname}`;
    const filePath = `${uploadDirectory}/${fileName}`;
    const pdf = new PdfReader(filePath);
    text = await pdf.read();
  } catch (e) {
    console.log(e);
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
