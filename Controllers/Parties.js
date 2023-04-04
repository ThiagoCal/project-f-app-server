import  {Category, Music, Party, PartyTypeCategory, PartyMusicCategory} from "../models/Party_model.js";
import { Op } from 'sequelize';
import moment from 'moment';
import jwt from "jsonwebtoken";
import validator from "validator";

export const createParty = async(req, res) =>{
  console.log('req.body', req.body)

  let selectedCategories = req.body.selectedCategory
  let selectedMusicTypes = req.body.selectedMusic

  const partyReceived = {
    name : req.body.partyName,
    description : req.body.description,
    price : req.body.price,
    party_date : req.body.date,
    category : req.body.category,
    is_active : req.body.is_active,
    categoryid: selectedCategories,
    musicid: selectedMusicTypes,
    address : req.body.fullAddress,
    address_name : req.body.address,
    address_number : req.body.addressNumber,
    zipcode: req.body.zipcode,
    city : req.body.city,
    latitude : req.body.latitude,
    longitude : req.body.longitude
  }

  if (!partyReceived.name || !partyReceived.address || !partyReceived.price) {
    return res.status(400).json({ error: "Please provide all required fields" });
  }

  try {
    const party = await Party.create(partyReceived);

    const bulkPCategories = selectedCategories.map(elem => {
      return {party_id:party.dataValues.id, category_id: elem}
    })
    const bulkMCategories = selectedMusicTypes.map(elem => {
      return {party_id:party.dataValues.id, music_id: elem}
    })

    const partyCategory = await PartyTypeCategory.bulkCreate(bulkPCategories)
    const partyMusicCategory = await PartyMusicCategory.bulkCreate(bulkMCategories)

    res.json({msg: 'Register Successful!', party: party, party_category: partyCategory, music_category: partyCategory })
  }catch(err){
    console.log(err)
    res.status(409).json({msg: 'Party already exists'})
  }
}


export const getParties = async(req, res) =>{
  try {
    const parties = await Party.findAll({
      attributes:['id', 'user_id', 'name', 'address', 'price', 'categoryid', 'party_date', 'musicid', 'address_name', 'address_number', 'city', 'zipcode', 'description', 'latitude', 'longitude']
    })
    res.json(parties)
  } catch (error) {
    console.log(error)
  }
}

export const getUserParties = async(req, res) =>{
  const userId  = req.params.userId
  try {
    const parties = await Party.findAll({ where:{ user_id: userId},
      attributes:['id', 'user_id', 'name', 'address', 'price', 'categoryid', 'party_date','musicid', 'address_name', 'address_number', 'city', 'zipcode', 'description', 'latitude', 'longitude']
    })
    res.json(parties)
  } catch (error) {
    res.status(500).json({msg: "Server error - while trying to find user parties"})
  }
}


export const getSearchParties = async(req, res) =>{
  const { name, city, party_date, address } = req.query;
  console.log(party_date)
  const startOfDay = moment.utc(party_date).startOf('day');
  const endOfDay = moment.utc(party_date).endOf('day');

  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }
  if (party_date) {
    where.party_date = {[Op.between]: [startOfDay, endOfDay]}
  }
  if (city) {
    where.city = { [Op.iLike]: `%${city}%` };
  }
  if (address) {
    where.address = { [Op.iLike]: `%${address}%` };
  }

  try {
    const parties = await Party.findAll({
      where,
      attributes:['id', 'user_id', 'name', 'address', 'price', 'categoryid', 'party_date', 'musicid', 'address_name', 'address_number', 'city', 'zipcode', 'description', 'latitude', 'longitude']
    })
    res.json(parties)
  } catch (error) {
    console.log(error)
    res.status(500).json({msg: "Server error"})
  }
}

export const findParty = async(req,res) => {
  const partyId = req.params.partyId
  try {
    const party = await Party.findOne({where: {id: partyId}})
    if(!party){
      res.status(404).json({msg: "Couldn't find the party"})
    }
  res.json(party)
  } catch (error) {
    res.status(500).json({msg: "Error trying to find the party"})
  }
}

export const updateParty = async (req, res) => {
  try {
    const party = await Party.findByPk(req.params.id);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    console.log('inside update', req.body)
    party.name = req.body.partyName;
    party.address = req.body.fullAddress;
    party.address_name = req.body.address;
    party.address_number = req.body.addressNumber;
    party.city = req.body.city;
    party.zipcode = req.body.zipcode;
    party.musicid = req.body.musicid;
    party.categoryid = req.body.categoryid
    // party.address = req.body.address;
    // party.category = req.body.category;
    party.description = req.body.description;
    party.price = req.body.price;
    party.rating = req.body.rating;
    party.latitude = req.body.latitude;
    party.longitude = req.body.longitude;
    party.party_date = req.body.party_date;
    party.is_active = req.body.is_active;

    if (!party.name || !party.address || !party.price) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    await party.save();

    // try {
      // const partycategory = await PartyTypeCategory.findOne({where: {id: party.id}})
      // if(partycategory){
      //   await partycategory.destroy()
      //   const bulkPCategories = selectedCategories.map(elem => {
      //     return {party_id:party.dataValues.id, category_id: elem}
      //   })
      //   await PartyTypeCategory.bulkCreate(bulkPCategories)
       // }

      // const musiccategory = await PartyMusicCategory.findOne({where: {id: party.id}})

      // if(musiccategory){
      //   const bulkMCategories = selectedMusicTypes.map(elem => {
      //     return {party_id:party.dataValues.id, music_id: elem}
      //   })
      //   await PartyMusicCategory.bulkCreate(bulkMCategories)
      // }

      res.json({msg: 'Update Successful!'})
    // }catch(err){
    //   console.log(err)
    //   res.status(409).json({msg: 'Error updating party - in party category or music category'})
    // }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error updating party' });
  }
};


export const deleteParty = async (req, res) => {
  try {
    const party = await Party.findByPk(req.params.id);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    await party.destroy();
    return res.json({msg : 'Party was deleted'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error deleting party' });
  }
};

export const getCategories = async(req, res) =>{
  try {
    const categories = await Category.findAll({
      attributes:['category_id', 'category_name']
    })
    res.json(categories)
  } catch (error) {
    console.log(error)
  }
}

export const getMusicTypes = async(req, res) =>{
  try {
    const music_types = await Music.findAll({
      attributes:['music_id', 'category_name']
    })
    res.json(music_types)
  } catch (error) {
    console.log(error)
  }
}