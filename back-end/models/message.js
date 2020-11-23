"use strict";
const config = require("../config/app");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Chat, { foreignKey: "chatId" });
      this.belongsTo(models.User, { foreignKey: "fromUserId" });
    }
  }
  Message.init(
    {
      type: DataTypes.STRING,
      message: {
        type: DataTypes.TEXT,

        get() {
          const type = this.getDataValue("type");
          const id = this.getDataValue("chatId");
          const content = this.getDataValue("message");

          // Aqui se revisa si el tipo de mensaje es texto plano o si es una imagen, para asi regresar la ruta en donde se enncuentra
          return type === "text"
            ? content
            : `${config.appUrl}:${config.appPort}/chat/${id}/${content}`;
        },
      },
      chatId: DataTypes.INTEGER,
      fromUserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
