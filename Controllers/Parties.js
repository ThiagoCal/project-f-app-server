import Party from "../models/Party_model.js";
import { Op } from 'sequelize';
import moment from 'moment';

// import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import validator from "validator";

//d	user_id	name	address	category	party_date	description	price	rating	is_active	latitude	longitude	created_at	updated_at	categoryid	musicid	address_name	address_number	city	zipcode
export const createParty = async(req, res) =>{
  console.log(req.body)
  const {user_id, name, address, party_date, categoryid, musicid, address_name, city, zipcode, address_number, description, price, rating, is_active, latitude = 0.0, longitude = 0.0, created_at, updated_at} = req.body;
  // const now = moment().tz('Israel');
  // Validate input data
  if (!user_id || !name || !address || !price) {
    return res.status(400).json({ error: "Please provide all required fields" });
  }

  try {
    await Party.create({
      user_id,
      name,
      address,
      party_date,
      categoryid,
      musicid,
      address_name,
      city, 
      zipcode,
      address_number,
      description,
      price,
      rating,
      is_active,
      latitude,
      longitude,
      created_at,
      updated_at
    });
    res.json({msg: 'Register Successful!'})
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
  // const party_date = moment.tz(req.body.party_date, 'Asia/Jerusalem').toDate();
  console.log(party_date)
  // Set the start and end of day using the Israel timezone
  const startOfDay = moment.utc(party_date).startOf('day');
  const endOfDay = moment.utc(party_date).endOf('day');
  // const endOfDay = moment.utc(party_date).endOf('day');
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
    party.name = req.body.name;
    party.address = req.body.address;
    party.address_name = req.body.address_name;
    party.address_number = req.body.address_number;
    party.zipcode = req.body.zipcode;
    party.musicid = req.body.musicid;
    party.categoryid = req.body.categoryid
    party.address = req.body.address;
    // party.category = req.body.category;
    party.description = req.body.description;
    party.price = req.body.price;
    party.rating = req.body.rating;
    party.latitude = req.body.latitude;
    party.longitude = req.body.longitude;
    party.party_date = req.body.party_date;
    party.is_active = req.body.is_active;

    await party.save();

    return res.json(party);
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
