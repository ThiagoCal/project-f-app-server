import User from "../models/User_model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import validator from "validator";

export const register = async(req, res) =>{
  console.log(req.body)
  const {email, password, first_name, last_name, username, is_producer, is_admin, created_at, updated_at} = req.body;
  

  // Validate input data
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  if (!first_name || !last_name || !username) {
    return res.status(400).json({ error: "Please provide all required fields" });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashPassword,
      is_producer,
      is_admin,
      created_at,
      updated_at
    });
    res.json({msg: 'Register Successful!'})
  }catch(err){
    console.log(err)
    res.status(403).json({msg: 'Email already exists'})
  }
}

export const getUsers = async(req, res)=>{
  try{
    const users = await User.findAll({
      attributes: ['id', 'email', 'username', 'first_name', 'last_name']
    })
    res.json(users)
  }catch(e){
    console.log(e)
    res.status(404).json({msg: 'not found'})
  }
}

export const findUser = async(req, res)=>{
  const userId = req.params.userId
  try {
    const user = await User.findOne({where: {id : userId}})
    if(!user){
      res.status(404).json({msg: "Couldn't find user"})
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({msg: "Server error - couldn't find user"})
  }
}

export const updateUser = async(req, res)=>{
  const userId = req.params.userId
  const { first_name, last_name, is_producer } = req.body;
  try {
    const user = await User.findOne({where: {id : userId}})
    if(!user){
      res.status(404).json({msg: "Couldn't find user"})
    }

    if (req.body.email) {
      return res.status(400).json({ error: "Cannot update email" });
    }
    if ( req.body.username) {
      return res.status(400).json({ error: "Cannot update username" });
    }
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.is_producer = req.body.is_producer;

    await user.update({
      first_name,
      last_name,
      is_producer
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({msg: "Server error - couldn't find user"})
  }
}


export const deleteUser = async(req, res)=>{
  const userId = req.params.userId
  try {
    const user = await User.findOne({where: {id : userId}})
    if(!user){
      res.status(404).json({msg: "Couldn't find user"})
    }
    await user.detroy()
    res.json(user)
  } catch (error) {
    res.status(500).json({msg: "Server error - couldn't delete user"})
  }
}