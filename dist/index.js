"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./Routes/authRoutes"));
const shopRoutes_1 = __importDefault(require("./Routes/shopRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
const port = process.env.PORT || 7000;
const MONGO_URL = 'mongodb://localhost:27017/users';
mongoose_1.default
    .connect(MONGO_URL)
    .then(() => console.log('Database Connected'))
    .catch(error => console.log(error));
app.get('/', (req, res) => {
    res.send('Connected');
});
app.use('/auth', authRoutes_1.default);
app.use('/shops', shopRoutes_1.default);
app.listen(port, () => {
    console.log(`Listening to ${port}`);
});
