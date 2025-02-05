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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
if (process.env.NODE_ENV === 'development') {
    const corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    };
    app.use((0, cors_1.default)(corsOptions));
}
// 连接 MongoDB
mongoose_1.default.connect('mongodb://localhost:27017/bookstore');
// 定义 Book Schema
const bookSchema = new mongoose_1.default.Schema({
    author: String,
    name: String,
    pages: Number
});
const Book = mongoose_1.default.model('Book', bookSchema);
// 配置中间件
app.use(express_1.default.json());
// POST 路由用于创建新书
app.post('/api/book', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = new Book(req.body);
        yield book.save();
        res.status(200).json(book);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating book' });
    }
}));
const PORT = 1234;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
