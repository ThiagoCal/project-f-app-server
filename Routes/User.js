import express from "express";
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
import User from "../models/User_model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import multer from "multer";
const router = express.Router();
import path from "path";
import { userInfo } from "os";
const __dirname = path.resolve();

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
      const user = await User.findOne({ where: { id: payload.userid } });
      const userData = {
        id: user.dataValues.id,
        first_name: user.dataValues.first_name,
        last_name: user.dataValues.last_name,
        email: user.dataValues.email,
        username: user.dataValues.username,
        is_admin: user.dataValues.is_admin,
        is_producer: user.dataValues.is_producer,
      };
      console.log("userdata", userData);
      // if (!user) {

      //   return res.status(401).json({ message: 'Unauthorized' });
      // }

      // const accessToken = jwt.sign({ sub: user.id }, process.env.ACCESS_TOKEN, {
      //   expiresIn: '15m',
      // });

      return res
        .status(200)
        .json({ refreshToken: refreshToken, user: userData });
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  });
});
// router.get('/refreshtoken', RefreshToken)
// router.get('/token', VerifyToken, (req, res)=>{
//   const userid = req.userid;
//   const email = req.email;
//   const accessToken = jwt.sign({userid, email}, process.env.ACCESS_TOKEN, { expiresIn:'300s'})

//   res.cookie('accessToken', accessToken, {
//     httpOnly: true,
//     maxAge: 300 * 1000
//   })
//   res.status(200).json({msg: 'ok'})
// })
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

router.post("/create_party", createParty);
router.get("/parties", getParties);
router.get("/:userId/parties", getUserParties);
router.get("/parties/:partyId", findParty);
router.put("/parties/:id", updateParty);
router.delete("/parties/:id", deleteParty);
router.get("/parties_search", getSearchParties);

router.get("/party_categories_list", getCategories);
router.get("/music_types", getMusicTypes);

// parties?name=Awesome&party_date=2023-04-05&city=New%20York&address=123%20Main%20St
export default router;
