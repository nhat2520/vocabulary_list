let { handleSaveDefineWord, handleSaveConversation, handleGetAllKeywords, handleGetAllConversation, handleDeleteConversation, handleDeleteDefineWord} = require("../controllers/appController");
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

  
  return app.use("/", router);
};

module.exports = {
  initAppAPIRoutes,
};
