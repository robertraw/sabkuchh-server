import express from "express";
import bcrypt from 'bcrypt';
import {  getInventory } from "./controller/getAddr.js";
import { createUser, loginUser,userDetails, getUserStockDetails,
      sendStockData,requestAddItem} from "./controller/getUser.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { uploadImage } from "./uploadController.js";

const router = express.Router();
router.use('/uploads', express.static('uploads'));
router.post('/api/1.0/users', createUser);
router.post('/login', loginUser);
router.get('/api/1.0/user', verifyToken, userDetails);
router.get('/items', getInventory);
router.post('/api/stocks', verifyToken, sendStockData);
router.get('/api/stocks/:stockId/users',  getUserStockDetails); // New route
router.post('/api/requestAddItem',uploadImage,requestAddItem);
export default router;
