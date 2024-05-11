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
import { PdfReader } from "../../APIs/read_pdf.js";
const session = require('express-session')
const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: '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'
});

const fs = require("fs");

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
    const { firstName, lastName } = req.session.user;
    let text = req.session.user.data.body.text;
    fs.writeFile("./APIs/input.txt", text, async (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send('Error writing to file');
            return; 
        }
        try {
            let results = await chatGPTapi()
            res.render('results', { firstName, lastName, results});
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
            let results = await chatGPTapi()
            res.render('results', { firstName, lastName, results});
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
        //chỗ này ô tự đưa hàm chatGPTapi vào để xử lý cái text nha
    } catch (error) {
        console.error(error.message);
    }
    return text
};


let chatGPTapi = async() => {
    const apiKey = fs.readFileSync("./APIs/apiKey.txt", "utf8").trim();
    const prompt = fs.readFileSync("./APIs/prompt.txt", "utf8").trim();
    const input = fs.readFileSync("./APIs/input.txt", "utf8").trim();
    const test = new OpenAIChat(apiKey, prompt, input);
    var results = await test.chat()
    console.log(results)
    // Tách chuỗi thành mảng các cặp key-value
    let pairs = results.message.content.split(' / ').map(pair => pair.split(': '));
    // Tạo một đối tượng từ mảng các cặp key-value
    let resultMap = Object.fromEntries(pairs);
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
        let data = req.body;
        console.log(data)
        let text = "test cai";
        let conversation = await saveConversation(userId, text);

        for (let element of data) {
            await saveDefineWord(element[0], element[1], conversation.id);
        }
        //chỗ này ko redirect đc vì dùng fetch api nên phải redirect bằng thẻ a trong file results(chỗ nút save ấy)
        res.status(200);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
};

let handleGetAllConversation = async (req, res) => {
    try {
        let userId = req.session.user.id;
        let data = await getAllConversation(userId);
        res.send("oke")
    } catch (e) {
        console.log(e)
    }
};


let handleGetAllKeywords = async (req, res) => {
    try {
        let conversationId = req.query.conversationId;
        let data = await getAllKeyword(conversationId);
        return res.status(200).json(data);
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
