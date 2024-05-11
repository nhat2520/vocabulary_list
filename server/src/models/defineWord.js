'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class defineWord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  defineWord.init({
    keyword: DataTypes.STRING,
    defineWord: DataTypes.TEXT,
    conversationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'defineWord',
  }, {freezeTableName: true});
  return defineWord;
};