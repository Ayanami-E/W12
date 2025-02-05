import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

if (process.env.NODE_ENV === 'development') {
  const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
}

// 连接 MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore');

// 定义 Book Schema
const bookSchema = new mongoose.Schema({
  author: String,
  name: String,
  pages: Number
});

const Book = mongoose.model('Book', bookSchema);

// 配置中间件
app.use(express.json());

// POST 路由用于创建新书
app.post('/api/book', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error creating book' });
  }
});

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});