let {handleGetAllKeywords, handleGetAllConversation, handleDeleteConversation, handleDeleteDefineWord, handleChatGPTtext, handleChatGPTsubtitle, handleChatGPTpdf, handleSaveData} = require("../controllers/appController");
var express = require("express");
let router = express.Router();
const multer = require('multer');

let initAppAPIRoutes = (app) => {

  //API
  router.get("/api/get-all-conversation", handleGetAllConversation);
  router.get("/api/get-all-define-word", handleGetAllKeywords);

  router.delete("/api/delete-conversation", handleDeleteConversation);
  router.delete("/api/delete-define-word", handleDeleteDefineWord);

  router.post("/api/chat-gpt-text", handleChatGPTtext);
  router.post("/api/chat-gpt-subtitleYoutube", handleChatGPTsubtitle)

  //test
  router.post("/save-data", handleSaveData);

  //Xử lý file
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
       cb(null, file.originalname);
    }
  });
  const upload = multer({ storage });
  router.post("/api/chat-gpt-pdf", upload.single('file'),  handleChatGPTpdf)

  return app.use("/", router);
};


module.exports = {
  initAppAPIRoutes,
};
