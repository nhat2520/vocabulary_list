let { handleSaveDefineWord, handleSaveConversation, handleGetAllKeywords, handleGetAllConversation, handleDeleteConversation, handleDeleteDefineWord, handleChatGPTtext, handleChatGPTsubtitle, handleChatGPTpdf} = require("../controllers/appController");
var express = require("express");
let router = express.Router();
const multer = require('multer');

let initAppAPIRoutes = (app) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
       cb(null, file.originalname);
    }
  });
  const upload = multer({ storage });


  //API
  router.get("/api/get-all-conversation", handleGetAllConversation);
  router.get("/api/get-all-define-word", handleGetAllKeywords);

  router.post("/api/save-define-word", handleSaveDefineWord);
  router.post("/api/save-conversation", handleSaveConversation);

  router.delete("/api/delete-conversation", handleDeleteConversation);
  router.delete("/api/delete-define-word", handleDeleteDefineWord);

  router.post("/api/chat-gpt-text", handleChatGPTtext);
  router.post("/api/chat-gpt-subtitleYoutube", handleChatGPTsubtitle)
  router.post("/api/chat-gpt-pdf", upload.single('file'),  handleChatGPTpdf)

  return app.use("/", router);
};



module.exports = {
  initAppAPIRoutes,
};
