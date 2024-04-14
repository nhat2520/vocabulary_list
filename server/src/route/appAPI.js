let { handleSaveDefineWord, handleSaveConversation, handleGetAllKeywords, handleGetAllConversation, handleDeleteConversation, handleDeleteDefineWord, handleChatGPTtext, handleChatGPTsubtitle, handleChatGPTpdf} = require("../controllers/appController");
var express = require("express");
let router = express.Router();

let initAppAPIRoutes = (app) => {
  //API
  router.get("/api/get-all-conversation", handleGetAllConversation);
  router.get("/api/get-all-define-word", handleGetAllKeywords);

  router.post("/api/save-define-word", handleSaveDefineWord);
  router.post("/api/save-conversation", handleSaveConversation);

  router.delete("/api/delete-conversation", handleDeleteConversation);
  router.delete("/api/delete-define-word", handleDeleteDefineWord);

  router.post("/api/chat-gpt-text", handleChatGPTtext);
  router.post("/api/chat-gpt-subtitleYoutube", handleChatGPTsubtitle)
  router.post("/api/chat-gpt-subtitleYoutube", handleChatGPTpdf)

  
  return app.use("/", router);
};

module.exports = {
  initAppAPIRoutes,
};
