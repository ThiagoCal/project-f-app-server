import { Sequelize } from "sequelize";
import db from '../Config/db.js';
const { DataTypes } = Sequelize;


const Party = db.define('parties', {
  user_id: {
    type: DataTypes.UUID,
  },
  name: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.FLOAT
  },
  rating: {
    type: DataTypes.FLOAT
  },
  latitude: {
    type: DataTypes.FLOAT
  },
  longitude: {
    type: DataTypes.FLOAT
  },
  party_date: {
    type: DataTypes.DATE,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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


Party.associate = (models) => {
  Party.belongsTo(models.User,
    { foreignKey: 'user_id', as: 'user' });
};

export default Party;