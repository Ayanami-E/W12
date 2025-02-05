"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
// 中间件
app.use(express_1.default.json());
// CORS 配置
if (process.env.NODE_ENV === 'development') {
    const corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    };
    app.use((0, cors_1.default)(corsOptions));
}
// 连接 MongoDB
mongoose_1.default.connect('mongodb://127.0.0.1:27017/bookstore')
    .then(() => {
    console.log('Successfully connected to MongoDB.');
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
// Book Schema
const bookSchema = new mongoose_1.default.Schema({
    name: String,
    author: String,
    pages: Number
});
const Book = mongoose_1.default.model('Book', bookSchema);
// POST 路由
app.post('/api/book', async (req, res) => {
    try {
        const book = new Book(req.body);
        const savedBook = await book.save();
        res.status(200).json(savedBook);
    }
    catch (error) {
        res.status(500).json({ error: 'Error saving book' });
    }
});
const PORT = 1234;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
