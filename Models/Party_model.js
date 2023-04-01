import { Sequelize } from "sequelize";
import db from '../Config/db.js';
const { DataTypes } = Sequelize;


export const Party = db.define('parties', {
  user_id: {
    type: DataTypes.UUID,
  },
  name: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  address_name: {
    type: DataTypes.STRING
  },
  address_number: {
    type: DataTypes.INTEGER
  },
  city: {
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
  categoryid:{
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  musicid:{
    type: DataTypes.ARRAY(DataTypes.STRING),
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

export const Category = db.define('party_categories', {
  category_id : {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category_name : {
    type: DataTypes.STRING
  }
})

export const PartyTypeCategory = db.define('party_type_categories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  party_id: {
    type: DataTypes.UUID,
  },
  category_id: {
    type: DataTypes.INTEGER,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

export const Music = db.define('music_categories', {
  music_id : {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category_name : {
    type: DataTypes.STRING
  }
})

export const PartyMusicCategory = db.define('party_music_categories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  party_id: {
    type: DataTypes.UUID,
  },
  music_id: {
    type: DataTypes.INTEGER,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

Party.associate = (models) => {
  Party.belongsTo(models.User,
    { foreignKey: 'user_id', as: 'user' });
};

// Party.belongsToMany(Music,{ through: PartyMusicCategory});
// Music.belongsToMany(Party, {through: PartyMusicCategory});

// Party.belongsToMany(Category,{ through: PartyTypeCategory});
// Category.belongsToMany(Party, {through: PartyTypeCategory});


// export default Party;