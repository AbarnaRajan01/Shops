
import { addShop, deleteShop, getShopById, getShops, getShopsNearby } from "../Controllers/shopController";


const express = require('express')
const shopRouter = express.Router();


shopRouter.get('/allshops',getShops)
shopRouter.get('/shop/:id',getShopById)
shopRouter.post('/addshop',addShop)
shopRouter.delete('/deleteShop/:id',deleteShop)
shopRouter.get('/nearby',getShopsNearby)


export default shopRouter;
