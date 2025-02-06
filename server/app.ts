// server/src/app.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// 使用 JSON 解析中间件
app.use(express.json());

// 在开发环境下允许来自 http://localhost:3000 的跨域请求
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
} else {
  app.use(cors());
}

// 连接 MongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/bookstore', {
  serverSelectionTimeoutMS: 5000,
})
.then(async () => {
  const db = mongoose.connection.db;
  // 检查是否已存在 books 集合，如果不存在则创建
  const collections = await db.listCollections({ name: 'books' }).toArray();
  if (collections.length === 0) {
    await db.createCollection('books');
    console.log('Created "books" collection.');
  }
  console.log('Successfully connected to MongoDB.');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

//【新增代码】
// 添加一个中间件，确保每次请求前 "books" 集合存在
app.use(async (req, res, next) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'books' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('books');
      console.log('Re-created "books" collection.');
    }
  } catch (error) {
    console.error("Error ensuring 'books' collection exists:", error);
  }
  next();
});

// 定义书籍的 Mongoose Schema 与 Model  
const bookSchema = new mongoose.Schema({
  author: { type: String, required: true },
  name: { type: String, required: true },
  pages: { type: Number, required: true }
}, { collection: 'books' });

const Book = mongoose.model('Book', bookSchema);

// 创建 POST 路由 /api/book，用于接收书籍数据并存入数据库
app.post('/api/book', async (req, res) => {
  try {
    const { author, name, pages } = req.body;
    const book = new Book({ author, name, pages });
    const savedBook = await book.save();
    res.status(200).json(savedBook);
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ error: 'Error saving book' });
  }
});

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
