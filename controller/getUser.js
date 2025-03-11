import fs from "fs";
import Joi  from 'joi'
import bcrypt from 'bcrypt'
import jwt from  'jsonwebtoken'
import mongoose from "mongoose"

import { loginSchema, signupSchema, User } from '../models/village.js';
import { uploadImage } from '../uploadController.js';

export const createUser = async (req, res) => {
  try {
    const { name, phone, password,village,block,district } = req.body
    const { error } = await signupSchema.validateAsync({name,phone,password});  
    const existingUser = await User.findOne({ phone });
       if (existingUser) {
       res.status(409).send('user exist');
    }
   else if (!error) {
    const hashedPass = await bcrypt.hash(password, 10);
      const newUser =new User( {
        id: Date.now().toString(),
        name, phone, password:hashedPass,stocks:[],village:village,block:block,district:district
      });
      await newUser.save();  
      res.status(201).send(newUser)
    }
      else{
      res.status(400).json('please check all the fields'); 
      return;
      }}
   catch (err) {
    console.error(err);
    res.status(500).send('internal server error')
  }
}
export const loginUser = async (req, res) => {
  try {
    let { phone, password } = req.body;
    const { error } = await loginSchema.validateAsync({phone,password});
    if (error) { 
      res.status(400).send()
      return;
    } 
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ phone }, process.env.SECRET);
    console.log('logged in')
    res.status(200).json({ token });
  } catch (error) { 
    console.error(error)
    res.status(500).json({ error: 'Internal server error' });
  }
}
// Protected route to get user details
export const userDetails= async (req, res) => {
  try {
    // Fetch user details using decoded token 
    const user = await User.findOne({ phone: req.user.phone });
    if (!user) {  
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const sendStockData=async (req,res)=>{
    try {
      const stocks = req.user.stocks;
      const user = await User.findOne({ phone: req.user.phone });
    if (!user) {  
      return res.status(404).json({ error: 'User not found' });
    }
    user.stocks = stocks;
    await user.save();
    res.status(200).send('ok');
    } catch (error) {
      console.error('Error saving stock:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
   

export const onBoardUser = (req, res) => {
  const customer = req.body;
  const token = sign(customer.email, secret);
  const dir = './public/' + token;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  } try {
    sendConfirmationEmail(customer.name, customer.email, customer.client, token);
    res.send(token);
  } catch (error) {
    res.send(null)
  }
}
export const uploadShopImage = async (req, res) => {
  try {
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({ message: "Image uploaded successfully", imageUrl });
    } else {
      res.status(400).send("No file uploaded");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const getUserStockDetails = async (req, res) => {
  try {
    const { stockId } = req.params;

    // Convert stockId to ObjectId
    const stockObjectId = mongoose.Types.ObjectId(stockId);

    // Find users who have the specified stock and project only the relevant fields
    const usersWithStock = await User.aggregate([
      { $match: { 'stocks._id': stockObjectId } },
      { $unwind: '$stocks' },
      { $match: { 'stocks._id': stockObjectId } },
      { $project: { _id: 1, 'stocks.quantity': 1 } }
    ]);
// console.log(usersWithStock)
    // Extract user IDs and quantities
    const userStockDetails = usersWithStock.map(user => ({
      userId: user._id,
      quantity: user.stocks.quantity,
    }));

    res.status(200).json(userStockDetails);
  } catch (error) {
    console.error('Error fetching user stock details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateOrderedHistory = async (req, res) => {
  try {
    const { userId, stocks } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prepare the stocks array
    const stockEntries = stocks.map(stock => ({
      stockId: mongoose.Types.ObjectId(stock.stockId),
      quantity: stock.quantity,
    }));

    // Update the ordered history
    user.orderedHistory.push({
      date: new Date(),
      stocks: stockEntries,
    });

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Ordered history updated successfully' });
  } catch (error) {
    console.error('Error updating ordered history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('orderedHistory.stocks.stockId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user.orderedHistory);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const requestAddItem = async (req, res) => {
  try {
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({ message: "Item added successfully", imageUrl });
    } else {
      res.status(400).send("No file uploaded");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};