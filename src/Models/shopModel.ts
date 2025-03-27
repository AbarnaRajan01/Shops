const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ShopSchema = new Schema({
    id: { type: String, required: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


 export const ShopModel = mongoose.model('Shop', ShopSchema);

