import mongoose from "mongoose"
import { User } from '../models/village.js';


export const getStockUserDetails = async (req, res) => {
    try {
      const { district, block, village } = req.params; // Include district and block
      const user = await User.findOne({ district, block, village });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const {stocks} =user;
      res.status(200).json(stocks);
    } catch (error) {
      console.error('Error fetching user stock details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const updateOrderedHistory = async (req, res) => {
    try {
      const { district, block, village } = req.params; // Include district and block
      // Find the user by village
      const user = await User.findOne({ district, block, village });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const { stocks } = user;
      // Prepare the stocks array
      const orderedEntries = stocks.map(stock => ({
        stockId: mongoose.Types.ObjectId(stock?.stockId),
        name: stock.name,
        quantity: stock.maxQuantity - stock.quantity,
      }));
      // Update the ordered history with district, block, and village
      user.orderedHistory.push({
        date: new Date(),
        location: { district, block, village }, // Add location details
        stocks: orderedEntries,
      });

      // Save the updated user
      await user.save();
      console.log(user.orderedHistory);
      res.status(200).json({ message: 'Ordered history updated successfully' });
    } catch (error) {
      console.error('Error updating ordered history:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const getOrderHistory = async (req, res) => {
    try {
      const {phone}=req.user;
      console.log(phone);
      const user = await User.findOne({phone});
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user.orderedHistory);
    } catch (error) {
      console.error('Error fetching order history:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const getStockByLocation = async (req, res) => {
    try {
      const { district, block, village, stockName } = req.params; // Replace stockId with stockName
      let matchCondition = {};
      if (district != 'null') {
        matchCondition.district = district;
      }
      if (block != 'null') {
        matchCondition.block = block;
      }
      if (village != 'null') {
        matchCondition.village = village;
      }
      // Find users matching the location
      console.log('matchCondition', matchCondition);
      const usersStock = await User.aggregate([
        { $match: matchCondition },
        { $unwind: '$stocks' },
        ...(stockName !== 'null' ? [{ $match: { 'stocks.name': stockName } }] : []), // Match by stock name if provided
        { $project: { _id: 0, maxQuantity: 1, 'stocks.maxQuantity': 1, 'stocks.quantity': 1, 'stocks.name': 1 } }
      ]);
      res.status(200).json(usersStock); // Return the stocks directly
    } catch (error) {
      console.error('Error fetching stock by location:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };