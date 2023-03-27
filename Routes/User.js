import express from 'express'
import {register, getUsers, login, updateUser, deleteUser} from "../Controllers/Users.js"
import { RefreshToken, VerifyToken } from '../Middleware/VerifyToken.js';
import { createParty, getParties, getUserParties, findParty, updateParty, deleteParty } from '../Controllers/Parties.js';

import jwt from 'jsonwebtoken'
import multer from 'multer';
const router = express.Router();
import path from 'path'
const __dirname = path.resolve();

router.post('/register', register);
router.get('/users', getUsers)
router.post('/login', login)
router.get('/refreshtoken', RefreshToken)
router.get('/token', VerifyToken, (req, res)=>{
  const userid = req.userid;
  const email = req.email;
  const accessToken = jwt.sign({userid, email}, process.env.ACCESS_TOKEN, { expiresIn:'300s'})

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 300 * 1000
  })
  res.status(200).json({msg: 'ok'})
})
// router.post('/passwordReset', requestPasswordReset)

router.put('/users/:userId', updateUser)
router.delete('/users/:userId', deleteUser)

router.post('/create_party', createParty);
router.get('/parties', getParties)
router.get('/users/:userId/parties', getUserParties)
router.get('/parties/:partyId', findParty)
router.put('/parties/:id', updateParty)
router.delete('/parties/:id', deleteParty)

export default router