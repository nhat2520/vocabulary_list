let {
    saveDefineWord,
    saveConversation,
    getAllKeyword,
    getAllConversation,
    deleteConversation,
    deleteDefineKeyword,
} = require("../services/appService");
import { text } from "body-parser";
import { OpenAIChat } from "../../APIs/chatGPT_api.js";
import { YouTubeCaptions } from "../../APIs/get_subtitles.js";
import { PdfReader } from "../../APIs/read_pdf.js";
const session = require('express-session')

const fs = require("fs");

let handleDeleteConversation = async (req, res) => {
    let id = req.session.user.conversationId;
    console.log(id)
    await deleteConversation(id);
    res.redirect('/')
};

let handleDeleteDefineWord = async (req, res) => {
    let id = req.body.id;
    let message = await deleteDefineKeyword(id);
    return res.status(200).json(message);
};


let handleChatGPTtext = async (req, res) => {
    const { firstName, lastName } = req.session.user;
    const text = req.session.user.data.body.text
    fs.writeFile("./APIs/input.txt", text, async (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send('Error writing to file');
            return; 
        }
        try {
            let results = await chatGPTapi(req)
            const conversations = await handleGetAllConversation(req, res)
            console.log(conversations)
            res.render('results', { firstName,lastName,conversations, results});
        } catch (error) {
            console.error('Error handling ChatGPT text:', error);
            res.status(500).send('Server Error');
        }
    });
};

let handleChatGPTsubtitle = async (req, res) => {
    
    const { firstName, lastName } = req.session.user;
    let link = req.session.user.data.body.url
    let text = await getSubtitlesFromLink(link)
    fs.writeFileSync("./APIs/input.txt", text, (err) => {
      // In case of a error throw err.
      if (err) throw err;
    });
    fs.writeFile("./APIs/input.txt", text, async (err) => {
        if (err) { 
            console.error('Error writing to file:', err);
            res.status(500).send('Error writing to file');
            return; 
        }
        try {
            let results = await chatGPTapi(req)
            const conversations = await handleGetAllConversation(req, res)
            console.log(conversations)
            res.render('results', { firstName, lastName,conversations, results});
        } catch (error) {
            console.error('Error handling ChatGPT text:', error);
            res.status(500).send('Server Error');
        }
    });
};

let handleChatGPTpdf = async (req, res) => {
    let file = req.file;
    let text = "";
    try {
        let pdfReader = new PdfReader(file.path);
        text = await pdfReader.read();
    } catch (error) {
        console.error(error.message);
    }
    return text
};


let chatGPTapi = async(req) => {
    console.log(2)
    const apiKey = fs.readFileSync("./APIs/apiKey.txt", "utf8").trim();
    const prompt = fs.readFileSync("./APIs/prompt.txt", "utf8").trim();
    const input = fs.readFileSync("./APIs/input.txt", "utf8").trim();
    const test = new OpenAIChat(apiKey, prompt, input);
    var results = await test.chat()
    // Tách chuỗi thành mảng các cặp key-value
    let pairs = results.message.content.split(' / ').map(pair => pair.split(': '));
    // Tạo một đối tượng từ mảng các cặp key-value
    let resultMap = Object.fromEntries(pairs);
    //truyền text và results đã được chatgpt xử lý để handleSaveData xử lý
    req.session.user.data.body.text = input
    req.session.user.data.body.results = results.message.content
    return resultMap
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


let handleSaveData = async (req, res) => {
    try {
        let userId = req.session.user.id; 
        let text = req.session.user.data.body.text;
        let results =  req.session.user.data.body.results
        let conversation = await saveConversation(userId, text);

        // Tách chuỗi thành mảng các cặp key-value
        let pairs = results.split(' / ').map(pair => pair.split(': '));
        // Tạo một đối tượng từ mảng các cặp key-value
        let data = Object.fromEntries(pairs);
        console.log(data)
        for (let [key, value] of Object.entries(data)) {
            await saveDefineWord(key, value, conversation.id);
        }
        res.redirect('/')
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
};

let handleGetAllConversation = async (req, res) => {
    try {
        let userId = req.session.user.id;
        let data = await getAllConversation(userId);
        data.forEach(conversation => {
            const date = new Date(conversation.dataValues.time);
            conversation.formattedTime = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
        });        
        return data
    } catch (e) {
        console.log(e)
    } 
};


let handleGetAllKeywords = async (req, res) => {
    try {
        let conversationId = req.params.id;
        const { firstName, lastName } = req.session.user;
        req.session.user.conversationId = req.params.id
        const conversations = await handleGetAllConversation(req, res)
        let results = await getAllKeyword(conversationId);
        res.render('history',{firstName, lastName, conversations, results})
    } catch (e) {
        console.log(e)
    }
};

module.exports = {
    handleGetAllKeywords,
    handleGetAllConversation,
    handleDeleteConversation,
    handleDeleteDefineWord,
    handleChatGPTtext,
    handleChatGPTsubtitle,
    handleChatGPTpdf,
    handleSaveData
};
