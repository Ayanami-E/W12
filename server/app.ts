import express from 'express';
import cors from 'cors';  // 引入cors包
import mongoose from 'mongoose';

const app = express();

// 启用CORS，允许来自http://localhost:3000的请求
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());

// MongoDB连接和应用逻辑
mongoose.connect('mongodb://127.0.0.1:27017/bookstore')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const bookSchema = new mongoose.Schema({
  author: { type: String, required: true },
  name: { type: String, required: true },
  pages: { type: Number, required: true }
});

const Book = mongoose.model('Book', bookSchema);

// POST路由：添加书籍
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
