import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './Routes/authRoutes';
import shopRouter from './Routes/shopRoutes';


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const port = process.env.PORT || 7000;

const MONGO_URL = 'mongodb://localhost:27017/users';
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('Database Connected'))
  .catch(error => console.log(error));

app.get('/', (req, res) => {
  res.send('Connected');
});
app.use('/auth', router);
app.use('/shops',shopRouter)


app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
