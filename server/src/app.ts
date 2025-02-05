import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// 中间件
app.use(express.json());

// CORS 配置
if (process.env.NODE_ENV === 'development') {
  const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
}

// 连接 MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookstore')
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Book Schema
const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  pages: Number
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

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;