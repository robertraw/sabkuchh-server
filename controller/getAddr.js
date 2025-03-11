import {Inventory} from 
'../models/village.js'

export const getInventory=async(request,reply)=>{
    const inventories= await Inventory.find()
    reply.send(inventories)
}