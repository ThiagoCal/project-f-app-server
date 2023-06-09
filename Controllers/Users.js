import User from "../Models/User_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import passport from "passport";
import cookieParser from "cookie-parser";
import { Strategy as JwtStrategy, Strategy } from "passport-jwt";

const accessTokenExpirationTime = "1h";
const refreshTokenExpirationTime = 2 * 24 * 60 * 60; // 2 days in seconds

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["refreshToken"];
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.SECRETKEY,
  algorithms: ["HS256"],
};

passport.use(
  new Strategy(jwtOptions, function (payload, done) {
    console.log("JWT payload:", payload);
    return done(null, payload);
  })
);

export const register = async (req, res) => {
  console.log(req.body);
  const {
    email,
    password,
    firstName,
    lastName,
    username,
    isProducer,
    is_admin,
    created_at,
    updated_at,
  } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address" });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }
  if (!firstName || !lastName || !username) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await User.create({
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      password: hashPassword,
      is_producer: isProducer,
      is_admin,
      created_at,
      updated_at,
    });
    res.json({ msg: "Register Successful!" });
  } catch (err) {
    console.log(err);
    res.status(403).json({ msg: "Email already exists" });
  }
};

export const login = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    const userid = user.id;
    const email = user.email;
    const accessToken = jwt.sign({ userid, email }, process.env.ACCESS_TOKEN, {
      expiresIn: "300s",
    });
    const refreshToken = jwt.sign({ userid, email }, process.env.SECRETKEY, {
      expiresIn: refreshTokenExpirationTime,
    });
    console.log("accesstoken", accessToken);
    console.log("refreshtoken", accessToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpirationTime * 1000,
    });
    console.log("req.cookies", req.cookies);
    res.json({ accessToken, user });
  } catch (e) {
    console.log(e);
    res.status(404).json({ msg: "Email not found" });
  }
};

export const logout = (req, res) => {
  console.log("logout", req.cookies);
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.sendStatus(200);
  console.log("logout2", req.cookies);
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "username", "first_name", "last_name"],
    });
    res.json(users);
  } catch (e) {
    console.log(e);
    res.status(404).json({ msg: "not found" });
  }
};

export const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ msg: "Couldn't find user" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error - couldn't find user" });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  const { first_name, last_name, is_producer, email } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ msg: "Couldn't find user" });
    }
    // if (req.body.email) {
    //   return res.status(400).json({ error: "Cannot update email" });
    // }
    // if (req.body.username) {
    //   return res.status(400).json({ error: "Cannot update username" });
    // }
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.is_producer = req.body.is_producer;
    user.email = req.body.email;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error - couldn't find user" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ msg: "Couldn't find user" });
    }
    await user.detroy();
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error - couldn't delete user" });
  }
};
