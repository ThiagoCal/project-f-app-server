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
  categoryId: {
    type: DataTypes.INTEGER
  },
  musicId: {
    type: DataTypes.INTEGER
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

const Category = db.define('party_categories', {
  category_id : {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category_name : {
    type: DataTypes.STRING
  }
})

const Music = db.define('music_categories', {
  music_id : {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category_name : {
    type: DataTypes.STRING
  }
})

Party.associate = (models) => {
  Party.belongsTo(models.User,
    { foreignKey: 'user_id', as: 'user' });
};

// Party.belongsTo(Category, { foreignKey: 'categoryId', targetKey: 'category_id', as: 'category_type' });

// Party.belongsTo(Music, { foreignKey: 'musicId', targetKey: 'music_id', as: 'music_type' });



// db.Party.findAll({
//   raw: true,
//   attributes: attributes,
//   include: [{
//     model: db.Music,
//     required: true,
//     attributes: ['category_name']
//   }],
//   order: [['id', 'ASC']],
// }).then(Party => console.table(Party))
export default Party;