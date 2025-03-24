import bcrypt from 'bcrypt'
import jwt from  'jsonwebtoken'

import { loginSchema, signupSchema, User } from '../models/village.js';

export const createUser = async (req, res) => {
  try {
    const { name, phone, password,village,block,district,location } = req.body
    const { error } = await signupSchema.validateAsync({name,phone,password});  
    let existingUser = await User.findOne({  district, block, village });
    const loc=`${location.latitude},${location.longitude}`;
    if (existingUser) {
      return res.status(422).json({ message: 'दिए गए गाँव के लिए दुकान मौजुद है' });
    }
     existingUser = await User.findOne({ phone });
    if (existingUser) {
       res.status(409).send('user exist for given no.');
    }
   else if (!error) {
    const hashedPass = await bcrypt.hash(password, 10);
      const newUser =new User( {
        id: Date.now().toString(),
        name, phone, password:hashedPass,stocks:[],village:village,block:block,district:district,
        location:loc
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
      const stocks = req.user.requestBody.stocks;
      const wallet=req.user.requestBody.wallet;
      // console.log(stocks,wallet)
      const user = await User.findOne({ phone: req.user.phone });
    if (!user) {  
      return res.status(404).json({ error: 'User not found' });
    }
    user.stocks = stocks;
    user.wallet=wallet;
    await user.save();
    res.status(200).send('ok');
    } catch (error) {
      console.error('Error saving stock:', error);
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