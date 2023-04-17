import { Sequelize } from "sequelize";
import db from "../Config/db.js";
const { DataTypes } = Sequelize;
import User from "../Models/User_model.js";
export const Bookmark = db.define("Bookmark", {
  user_id: {
    type: DataTypes.UUID,
  },
  party_id: {
    type: DataTypes.UUID,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn("NOW"),
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn("NOW"),
  },
});
Bookmark.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Bookmark, { foreignKey: "user_id" });
export default Bookmark;
