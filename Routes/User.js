import express from 'express'
import {register, getUsers, login, updateUser, deleteUser, logout} from "../Controllers/Users.js"
import { verifyRefreshToken } from '../Middleware/VerifyToken.js';
import { createParty, getParties, getUserParties, findParty, updateParty, deleteParty, getSearchParties, getCategories, getMusicTypes } from '../Controllers/Parties.js';

import passport from 'passport'
import jwt from 'jsonwebtoken'
import multer from 'multer';
const router = express.Router();
import path from 'path'
const __dirname = path.resolve();

router.post('/register', register);
router.get('/users', getUsers)
router.post('/login', login)
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
router.get('/protected', verifyRefreshToken, passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(`Hello, ${req.user.username}!`);
});

router.put('/users/:userId', updateUser)
router.delete('/users/:userId', deleteUser)

router.post('/create_party', createParty);
router.get('/parties', getParties)
router.get('/users/:userId/parties', getUserParties)
router.get('/parties/:partyId', findParty)
router.put('/parties/:id', updateParty)
router.delete('/parties/:id', deleteParty)
router.get('/parties_search', getSearchParties)

router.get('/party_categories_list', getCategories)
router.get('/music_types', getMusicTypes)

// parties?name=Awesome&party_date=2023-04-05&city=New%20York&address=123%20Main%20St
export default router