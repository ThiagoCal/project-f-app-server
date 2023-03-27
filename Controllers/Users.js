import User from "../models/User_model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import validator from "validator";
// import sendEmail from '../utils/email/sendEmail.js';

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

export const login = async(req,res) =>{
  try{
    const user = await User.findAll({
      where:{
        email: req.body.email,
      }
    })
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if(!match){ return res.status(400).json({msg: "Invalid password"})}

    const userid = user[0].id;
    const email = user[0].email;
    const accessToken = jwt.sign({userid, email}, process.env.ACCESS_TOKEN, { expiresIn:'300s'})
    
    User.update({refresh_token: accessToken},{
      where:{
          id: userid
      }
    })
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 300 * 1000
    })

    res.json({accessToken})

  }catch(e){
    console.log(e)
    res.status(404).json({msg: "Email not found"})
  }
}

export const logout = async(req, res) =>{
 res.cookie('')
}
// export const requestPasswordReset = async (email) => {
//   const user = await User.findOne({ email });

//   if (!user) throw new Error("User does not exist");
  
//   let resetToken = crypto.randomBytes(32).toString("hex");
//   const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

//   user.resetPasswordToken = hash;
//   user.resetPasswordExpires = Date.now() + 3600000; // expires in 1 hour
//   await user.save();

//   const link = `http://localhost:3800/passwordReset?token=${resetToken}&id=${user.id}`;
//   sendEmail(user.email,"Password Reset Request",{name: user.name,link: link,},"'../utils/email/templates/requestResetPassword.handlebars");
//   return link;
// };

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