import { Request, Response } from 'express';
import { ShopList } from '../Datasets/shopData';





 interface Shop {
    id: string;
    name: string;
    
    category: string;
    picture: string;
    address: string;
    latitude: number;
    longitude: number;
    
}

// Function to count categories from shop list
const countCategories = (shopList: Shop[]) => {
    const categoryCounts: { [key: string]: number } = {};
    shopList.forEach(shop => {
      const category = shop.category;
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });
    return categoryCounts;
  };

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}



interface NewShop extends Omit<Shop, 'id' | 'createdAt' | 'updatedAt'> {} 
export const getShops = (req: Request, res: Response) => {
    try {
        res.json(ShopList);
    } catch (error) {
        res.status(500).json({ error });
    }
};
const CENTER_LATITUDE = 11.0168;
const CENTER_LONGITUDE = 76.9558;
export const getShopsNearby = (req: Request, res: Response) => {
    const { radius } = req.query;
    const userRadius = parseFloat(radius as string);

    if (!userRadius) {
        return res.status(400).json({ message: 'Radius is required as a query parameter.' });
    }

    try {
        const nearbyShops = ShopList.filter(shop => {
            const distance = calculateDistance(CENTER_LATITUDE, CENTER_LONGITUDE, shop.latitude, shop.longitude);
            return distance <= userRadius;
        });

        res.json(nearbyShops);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getShopById = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const shop = ShopList.find(shop => shop.id === id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.json(shop);
    } catch (error) {
        res.status(500).json({error});
    }
};


export const addShop = (req: Request, res: Response) => {
    const newShop: NewShop = req.body;
    try {
        const id = (ShopList.length + 1).toString(); 
        const createdAt = new Date();
        const updatedAt = new Date();
        const shop = { ...newShop, id, createdAt, updatedAt };
        ShopList.push(shop);
        res.status(201).json(shop);
    } catch (error) {
        res.status(500).json({ error });
    }
};


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


export const deleteShop = (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const index = ShopList.findIndex(shop => shop.id === id);
        if (index === -1) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const deletedShop = ShopList.splice(index, 1);
        res.json(deletedShop[0]);
    } catch (error) {
        res.status(500).json({ error });
    }
};
export const getCategoryCounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryCounts = countCategories(ShopList);
    res.status(200).json({ categoryCounts });
  } catch (error) {
    console.error('Error fetching category counts:', error);
    res.status(500).json({ message: 'Failed to fetch category counts' });
  }
};