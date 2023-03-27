import jwt from "jsonwebtoken";
import User from "../models/User_model.js";
import dotenv from 'dotenv';

export const VerifyToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken || req.headers['x-acces-token']
    if(!accessToken) return res.status(401).json({msg: 'Unauthorized Token - Permission Denied'})
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, async (err, decoded )=>{
      if(err) return res.status(403).json({msg: 'verify token failed'})

      req.email = decoded.email
      req.userid = decoded.userid

      try{
        const user = await User.findAll({
          where:{
            email: decoded.email
          }
        })
        user.length === 0 ? res.status(403).json({msg: 'verify user failed'}) :
        next()
      }catch(e){
        req.status(403).json({msg: 'verify user failed'})
      }
    })
}


export const RefreshToken = async (req, res, next) => {
  const user = await User.findOne({
    where:{
      email: req.body.email,
      id: req.body.id
    }
  })
  const accessToken = user[0].refresh_token
    if(!accessToken) return res.status(401).json({msg: 'Unauthorized Token - Permission Denied'})
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, async (err, decoded )=>{
      if(err) return res.status(403).json({msg: 'verify token failed'})
      next();
    })
}