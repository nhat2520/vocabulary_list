let {saveDefineWord, saveConversation, getAllKeyword, getAllConversation, deleteConversation, deleteDefineKeyword} = require('../services/appService')
let handleSaveDefineWord = async (req, res) => {
    let data = req.body;
    let message = await saveDefineWord(data);
    return res.status(200).json(message);
}

let handleSaveConversation = async (req, res) => {
    let data = req.body;
    let message = await saveConversation(data);
    return res.status(200).json(message);
}

let handleGetAllKeywords = async (req, res) => {
    let id = req.query.id;
    let data = await getAllKeyword(id);
    return res.status(200).json(data);
}

let handleGetAllConversation = async (req, res) => {
    let id = req.query.id;
    let data = await getAllConversation(id);
    return res.status(200).json(data);
}

let handleDeleteConversation = async (req, res) => {
    let id = req.body.id;
    let message = await deleteConversation(id);
    return res.status(200).json(message)
}

let handleDeleteDefineWord = async (req, res) => {
    let id = req.body.id;
    let message = await deleteDefineKeyword(id)
    return res.status(200).json(message)
}
module.exports = {
    handleSaveDefineWord,
    handleSaveConversation, 
    handleGetAllKeywords,
    handleGetAllConversation, 
    handleDeleteConversation, 
    handleDeleteDefineWord
}