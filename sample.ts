import express from 'express';
import { ShopList } from './src/Datasets/shopData';

const app = express();

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// Route to get nearby shops based on user's location
app.get('/nearby', (req, res) => {
  const { latitude, longitude, radius } = req.query;

  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ error: 'Latitude, longitude, and radius parameters are required.' });
  }

  const userLat = parseFloat(latitude as string);
  const userLng = parseFloat(longitude as string);
  const maxDistance = parseFloat(radius as string);

  const nearbyShops = ShopList.filter(shop => {
    const shopLat = shop.latitude;
    const shopLng = shop.longitude;
    const distance = calculateDistance(userLat, userLng, shopLat, shopLng);
    return distance <= maxDistance;
  });

  // Assuming you have an API to search nearby shops using a radius parameter
  // Replace 'searchAPIEndpoint' with your actual API endpoint
  const searchAPIEndpoint = 'https://example.com/api/shops/search';
  
  const apiParams = {
    latitude: userLat,
    longitude: userLng,
    radius: maxDistance
  };

  fetch(`${searchAPIEndpoint}?latitude=${userLat}&longitude=${userLng}&radius=${maxDistance}`)
    .then(response => response.json())
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Error fetching nearby shops:', error);
      res.status(500).json({ error: 'Failed to fetch nearby shops from API.' });
    });
});


