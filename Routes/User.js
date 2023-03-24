import express from 'express'
import {register, getUsers} from "../Controllers/Users.js"
import { createParty, getParties, getUserParties, findParty, updateParty, deleteParty } from '../Controllers/Parties.js';
// import { VerifyToken } from '../middleware/VerifyToken.js';
import jwt from 'jsonwebtoken'
const router = express.Router();


router.post('/register', register);
router.get('/users', getUsers)


router.post('/create_party', createParty);
router.get('/parties', getParties)
router.get('/users/:userId/parties', getUserParties)
router.get('/parties/:partyId/', findParty)
router.put('/parties/:id', updateParty)
router.delete('/parties/:id', deleteParty)

export default router