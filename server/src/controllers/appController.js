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
const session = require('express-session')
const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: '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'
});



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
    let link = req.body.link;
    let text = await getSubtitlesFromLink(link);
    fs.writeFileSync("./APIs/input.txt", text, (err) => {
      // In case of a error throw err.
      if (err) throw err;
    });
    const output = await chatGPTapi()
    return res.status(200).json({
      errCode: 0,
      errMessage: "Oke roi",
      output,
    });
};


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
    // const apiKey = fs.readFileSync("./APIs/apiKey.txt", "utf8").trim();
    // const prompt = fs.readFileSync("./APIs/prompt.txt", "utf8").trim();
    // const input = fs.readFileSync("./APIs/input.txt", "utf8").trim();
    // const test = new OpenAIChat(apiKey, prompt, input);
    // var results = await test.chat()
    // console.log(results)
    const results = 'Bachelor of Science: An undergraduate academic degree awarded for completed courses that generally last three to five years / University of Pennsylvania: A private Ivy League research university in Philadelphia, Pennsylvania / Trump Organization: The business conglomerate of Donald Trump, now run by his children / Skyscrapers: Very tall buildings with multiple stories / Casinos: Facilities for gambling and entertainment / Golf courses: Areas designed for playing the sport of golf / Reality television series: Television programs featuring unscripted real-life situations / Legal actions: Proceedings in a court of law to settle disputes / Business bankruptcies: Legal status of a person or an organization that cannot repay the debts owed'
    // Tách chuỗi thành mảng các cặp key-value
    let pairs = results.split(' / ').map(pair => pair.split(': '));
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
