import { Sequelize } from "sequelize";
import db from '../Config/db.js';
import Party from "./Party_model.js";
const { DataTypes } = Sequelize;

const User = db.define('users', {
  email: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  first_name: {
    type: DataTypes.STRING
  },
  last_name: {
    type: DataTypes.STRING
  },
  username: {
    type: DataTypes.STRING
  },
  is_producer: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  refresh_token:{
    type: DataTypes.STRING
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn("NOW"),
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn("NOW"),
  }
});

User.hasMany(Party, {as: 'parties', foreignKey: 'user_id' });

export default User;