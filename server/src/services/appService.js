let db = require('../models/index');
import { where } from 'sequelize';

let checkKeyWord = (keyword) => {
    return new Promise(async(resolve, reject)=>{

        try {

            let user = await db.defineWord.findOne({
                where: {keyword: keyword}
            })
            console.log("dang o save define")
            if(user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllKeyword = (conversationId) => {
    return new Promise(async(resolve, reject)=>{
        try {
            let keywords = await db.defineWord.findAll({
                where: {conversationId: conversationId}
            });
            resolve(keywords);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllConversation = (userId) => {
    return new Promise(async(resolve, reject)=>{
        try {
            let conversation = await db.Conversation.findAll({
                where: {userID: userId}
            });
            resolve(conversation);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteConversation = (conversationId) => {
    return new Promise(async(resolve, reject) => {
      try {
        let conversation = await db.Conversation.findOne({
          where: {id : conversationId}
        })
        if(!conversation) {
          resolve({
            errCode: 1, 
            errMessage: "Conversation is not in database!"
          });
        } else {
          await db.Conversation.destroy({
            where: {id : conversationId}
          });
          resolve({
            errCode: 0,
            errMessage: 'Conversation deleted'
          });
        }
      } catch (e) {
        reject(e);
      }
    })
}

let deleteDefineKeyword = (keywordId) => {
    return new Promise(async(resolve, reject) => {
        try {

          let dKeyword = await db.defineWord.findOne({
            where: {id : keywordId}
          })
          if(!dKeyword) {
            resolve({
              errCode: 1, 
              errMessage: "define keyword is not in database!"
            });
          } else {
            await db.defineWord.destroy({
              where: {id : keywordId}
            });
            resolve({
              errCode: 0,
              errMessage: 'Define keyword deleted'
            });
          }
        } catch (e) {
          reject(e);
        }
      })
}



let saveDefineWord = async(keyword, defineword, conversationId)=>{
    return new Promise(async(resolve, reject)=>{
        try {
                await db.defineWord.create({
                    keyword: keyword,
                    defineWord: defineword,
                    conversationId: conversationId
                })
                resolve({
                    errCode: 0,
                    errMessage: "Word saved succeed!",
                })
        } catch (e) {
            reject(e);
        }
    })
}

let saveConversation = (userId, text) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!text) {
                resolve({
                    errCode: 1,
                    errMessage: "Text empty! please enter the text"
                })
            } else {
                let conversation = await db.Conversation.create({
                    userID: userId,
                    time: Date.now(),
                    text: text,
                })
                resolve({
                    errCode: 0,
                    errMessage: "Save new conversation succeed",
                    id: conversation.id
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    saveDefineWord, 
    saveConversation, 
    getAllKeyword,
    getAllConversation, 
    deleteConversation,
    deleteDefineKeyword
}