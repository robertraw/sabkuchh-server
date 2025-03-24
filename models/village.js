import mongoose from "mongoose";
import Joi  from "joi";
import bcrypt from 'bcrypt'
const Schema = mongoose.Schema;

const villageSchema = new Schema({
    id: {
      type: Number
    },
    name: {
      type: String
    },
  block: {
    type: Schema.Types.ObjectId,
    ref: 'Block'
  }
});

const blockSchema = new Schema({
  id: {
    type: Number
  },
  name: {
    type: String
  },
  dist: {
    type: Schema.Types.ObjectId,
    ref: 'District'
  }
});

const districtSchema = new Schema({
  id: {
    type: Number
  },
  name: {
    type: String
  }
});

const inventorySchema = new Schema({  
  id: {
  type: Number
},
  name: {
    type: String,
    required: true,
    trim: true,
  },

  tags: { // Array of tags
    type: String, // Each tag is a string
    required: false, // Tags are optional
  },
  quantity: {
    type: Number,
    default:0,
    min: 0,
  },
  maxQuantity: {
    type: Number,
    default:10,
    min: 0,
  },
  images: {
    type: [String], // Path or URL
    required: false,
  },
varieties:[{
  size: {
    type: String, // Size could be a string (e.g., "S", "M", "L", "XL", etc.)
    required: false
  },
MRP:{
  type:Number,
  required:false    
  },
price: {
    type: Number, // Price as a number (e.g., 19.99)
    required: false
  }
}],
  // ... other fields (description, category, supplier, timestamps)
  description: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
})

const userSchema = new Schema({
  name: String,
  phone: Number,
  password: String,
  village:String,
  block:String,
  district:String,
  wallet:{
    type:Number,
    default:0
  },
  stocks:[{
    stock: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
    },
    name:{
      type:String,
      required:true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },maxQuantity: {
      type: Number,
      required: true,
      min: 0,
    }
  }],
  orderedHistory: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      stocks: [
        {
          stockId: {
            type: Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 0,
          },
        },
      ],
    },
  ],
}); 

const uriSchema = new Schema({
  uri: {
    type: String,
    required: true,
  }, 
});

export const signupSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().pattern(/^\d{10}$/
  ).required().messages({
    'string.pattern.base': 'Invalid mobile number. Please enter a 10-digit number.'
  }).required(),
  password: Joi.string().min(6).required()
});
export const loginSchema = Joi.object({
  phone: Joi.string().pattern(/^\d{10}$/
  ).required().messages({
    'string.pattern.base': 'Invalid mobile number. Please enter a 10-digit number.'
  }).required(),
  password: Joi.string().min(6).required()
});
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hash(this.password, 10);
  }
  next();
});
export const District = mongoose.model('District', districtSchema);
export const Block = mongoose.model('Block', blockSchema);
export const Village = mongoose.model('Village',villageSchema);
export const Inventory=mongoose.model('Inventory',inventorySchema)
export const User=mongoose.model('User',userSchema)
export const Uri = mongoose.model('Uri', uriSchema);