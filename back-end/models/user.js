"use strict";
const bcrypt = require("bcrypt");
const config = require("../config/app");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Chat, {
        through: "ChatUser",
        foreignKey: "userId",
      });
      this.hasMany(models.ChatUser, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      gender: DataTypes.STRING,
      avatar: {
        type: DataTypes.STRING,
        get() {
          // Con esto se obtiene el valor actual de avatar
          const avatar = this.getDataValue("avatar");
          const url = `${config.appUrl}:${config.appPort}`;

          // Si no existe un avatar, entonces se toma una imagen generica del servidor, las que se encuentran en public
          if (!avatar) {
            // Se regresa la ruta en donde se encuentran las imagenes de avatar por default (public)
            return `${url}/${this.getDataValue("gender")}.svg`;
          }

          // Si existe el avatar en la BD, entonces se obtiene el id
          const id = this.getDataValue("id");
          // se regresa la ruta en donde se encuentra la imagen de ese usuario
          return `${url}/user/${id}/${avatar}`;
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword,
      },
    }
  );
  return User;
};

const hashPassword = async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  return user;
};
