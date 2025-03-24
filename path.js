import express from "express";
import {  getInventory } from "./controller/getItem.js";
import { createUser, loginUser,userDetails, sendStockData,requestAddItem} from "./controller/getUser.js";
import {getStockUserDetails,getOrderHistory,updateOrderedHistory, getStockByLocation} from './controller/orderController.js'
      import { verifyToken } from "./middleware/verifyToken.js";
import { uploadImage } from "./uploadController.js";

const router = express.Router();
router.use('/uploads', express.static('uploads'));
router.post('/api/1.0/users', createUser);
router.post('/login', loginUser);
router.get('/api/1.0/user', verifyToken, userDetails);
router.get('/items', getInventory);
router.post('/api/stocks', verifyToken, sendStockData);
router.get('/api/:district/:block/:village/users',  getStockUserDetails); // New route
router.get('/api/:district/:block/:village/:stockName/users',  getStockByLocation); // New route
router.get('/api/updateOrderHistory/:village',updateOrderedHistory)
router.post('/api/requestAddItem',uploadImage,requestAddItem);
router.get('/api/orderhistory',verifyToken,getOrderHistory)
export default router;
