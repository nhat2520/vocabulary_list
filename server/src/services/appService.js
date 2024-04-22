let db = require('../models/index');
import { where } from 'sequelize';
let saveDefineWord = async(data)=>{
    
    return new Promise(async(resolve, reject)=>{
        try {
            let check = await checkKeyWord(data.keyWord)

            if(check) {
                console.log(await checkKeyWord(data.keyWord));
                resolve({
                    errCode: 1,
                    errMessage: "Keyword already exists",
                    hi: checkKeyWord(data.keyWord)
                })
            } else {
                await db.defineWord.create({
                    keyword: data.keyWord,
                    defineWord: data.defineWord
                })
                resolve({
                    errCode: 0,
                    errMessage: "Word saved succeed!",
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let saveConversation = (data) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.text) {
                resolve({
                    errCode: 1,
                    errMessage: "Text empty! please enter the text"
                })
            } else {
                await db.Conversation.create({
                    userID: data.userID,
                    time: data.time,
                    text: data.text,
                    keywordID: data.keywordID
                })
                resolve({
                    errCode: 0,
                    errMessage: "Save new conversation succeed",
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

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

let getAllKeyword = (id) => {
    return new Promise(async(resolve, reject)=>{
        try {
            let keywords = "";
            if (id == "ALL" || !id) {
                keywords = await db.defineWord.findAll();
            } 
            if(id && id != "ALL") {
                keywords = await db.defineWord.findOne({
                    where: {keyword : id} //neu id = keyword thi tra ve keyword
                })
                if(!keywords) {
                    resolve({
                        errCode: 1,
                        errMessage: "Keyword is not in database!"
                    })
                }
            }
            resolve(keywords);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllConversation = (id) => {
    return new Promise(async(resolve, reject)=>{
        try {
            let conversation = "";
            if (id == "ALL" || !id) {
                conversation = await db.Conversation.findAll();
            } 
            if(id && id != "ALL") {
                conversation = await db.Conversation.findOne({
                    where: {id : id} //neu id = keyword thi tra ve keyword
                })
                if(!conversation) {
                    resolve({
                        errCode: 1,
                        errMessage: "Conversation is not in database!"
                    })
                }
            }
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

module.exports = {
    saveDefineWord, 
    saveConversation, 
    getAllKeyword,
    getAllConversation, 
    deleteConversation,
    deleteDefineKeyword
}