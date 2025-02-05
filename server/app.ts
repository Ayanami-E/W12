import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// 启用 CORS
if (process.env.NODE_ENV === 'development') {
  const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
}

// 中间件
app.use(express.json());

// MongoDB 连接
mongoose.connect('mongodb://localhost:27017/bookstore')
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// 定义 Book Schema
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true }
});

const Book = mongoose.model('Book', bookSchema);

// POST 路由
app.post('/api/book', async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(200).json(savedBook);
  } catch (error) {
    res.status(500).json({ error: 'Error saving book' });
  }
});

// 启动服务器
const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;