"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryCounts = exports.deleteShop = exports.addShop = exports.getShopById = exports.getShopsNearby = exports.getShops = void 0;
const shopData_1 = require("../Datasets/shopData");
// Function to count categories from shop list
const countCategories = (shopList) => {
    const categoryCounts = {};
    shopList.forEach(shop => {
        const category = shop.category;
        if (categoryCounts[category]) {
            categoryCounts[category]++;
        }
        else {
            categoryCounts[category] = 1;
        }
    });
    return categoryCounts;
};
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
const getShops = (req, res) => {
    try {
        res.json(shopData_1.ShopList);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getShops = getShops;
const CENTER_LATITUDE = 11.0168;
const CENTER_LONGITUDE = 76.9558;
const getShopsNearby = (req, res) => {
    const { radius } = req.query;
    const userRadius = parseFloat(radius);
    if (!userRadius) {
        return res.status(400).json({ message: 'Radius is required as a query parameter.' });
    }
    try {
        const nearbyShops = shopData_1.ShopList.filter(shop => {
            const distance = calculateDistance(CENTER_LATITUDE, CENTER_LONGITUDE, shop.latitude, shop.longitude);
            return distance <= userRadius;
        });
        res.json(nearbyShops);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getShopsNearby = getShopsNearby;
const getShopById = (req, res) => {
    const { id } = req.params;
    try {
        const shop = shopData_1.ShopList.find(shop => shop.id === id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.json(shop);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getShopById = getShopById;
const addShop = (req, res) => {
    const newShop = req.body;
    try {
        const id = (shopData_1.ShopList.length + 1).toString();
        const createdAt = new Date();
        const updatedAt = new Date();
        const shop = Object.assign(Object.assign({}, newShop), { id, createdAt, updatedAt });
        shopData_1.ShopList.push(shop);
        res.status(201).json(shop);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.addShop = addShop;
// export const updateShop = (req: Request, res: Response) => {
//     const { id } = req.params;
//     const updatedShop: Partial<Shop> = req.body; 
//     try {
//         let shop = ShopList.find(shop => shop.id === id);
//         if (!shop) {
//             return res.status(404).json({ message: 'Shop not found' });
//         }
//         shop = { ...shop, ...updatedShop, id };
//         const index = ShopList.findIndex(shop => shop.id === id);
//         ShopList[index] = shop;
//         res.json(shop);
//     } catch (error) {
//         res.status(500).json({error });
//     }
// };
const deleteShop = (req, res) => {
    const { id } = req.params;
    try {
        const index = shopData_1.ShopList.findIndex(shop => shop.id === id);
        if (index === -1) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        const deletedShop = shopData_1.ShopList.splice(index, 1);
        res.json(deletedShop[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.deleteShop = deleteShop;
const getCategoryCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryCounts = countCategories(shopData_1.ShopList);
        res.status(200).json({ categoryCounts });
    }
    catch (error) {
        console.error('Error fetching category counts:', error);
        res.status(500).json({ message: 'Failed to fetch category counts' });
    }
});
exports.getCategoryCounts = getCategoryCounts;
