import express from "express";
import User from "../Models/User_model.js";
import {
  register,
  getUsers,
  login,
  updateUser,
  deleteUser,
  logout,
} from "../Controllers/Users.js";

import { verifyRefreshToken } from "../Middleware/VerifyToken.js";
import {
  createParty,
  getParties,
  getUserParties,
  findParty,
  updateParty,
  deleteParty,
  getSearchParties,
  getCategories,
  getMusicTypes,
} from "../Controllers/Parties.js";

import passport from "passport";
import jwt from "jsonwebtoken";
const router = express.Router();
import path from "path";
import { userInfo } from "os";

//-----------------Users Routes -------------------------
router.post("/register", register);
router.get("/users", getUsers);
router.post("/login", login);
router.get("/test", (req, res) => {
  console.log(req.cookies);
  res.json({ msg: "ok" });
});
router.get("/logout", logout);

router.get("/token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(refreshToken, process.env.SECRETKEY, async (err, payload) => {
    console.log(payload);
    console.log(process.env.SECRETKEY);
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const userres = await User.findOne({ where: { id: payload.userid } });
      const userData = {
        id: userres.dataValues.id,
        first_name: userres.dataValues.first_name,
        last_name: userres.dataValues.last_name,
        email: userres.dataValues.email,
        username: userres.dataValues.username,
        is_admin: userres.dataValues.is_admin,
        is_producer: userres.dataValues.is_producer,
      };
      console.log("userdata", userData);
      return res
        .status(200)
        .json({ refreshToken: refreshToken, user: userData });
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  });
});

// router.post('/passwordReset', requestPasswordReset)
router.get(
  "/protected",
  verifyRefreshToken,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(`Hello, ${req.user.username}!`);
  }
);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

//-----------------------Party Routes -----------------------------
router.post("/create_party", createParty);
router.get("/parties", getParties);
router.get("/:userId/parties", getUserParties);
router.get("/parties/:partyId", findParty);
router.put("/parties/:id", updateParty);
router.delete("/parties/:id", deleteParty);
router.get("/parties_search", getSearchParties);

router.get("/party_categories_list", getCategories);
router.get("/music_types", getMusicTypes);

export default router;
