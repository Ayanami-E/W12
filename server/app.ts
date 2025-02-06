// server/src/app.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

// 启用 CORS
app.use(cors());
app.use(bodyParser.json());

// 连接到 MongoDB
mongoose.connect('mongodb://localhost:27017/booksdb', { useUnifiedTopology: true,})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// 创建 Book 模型
const bookSchema = new mongoose.Schema({
  author: String,
  name: String,
  pages: Number,
});
const Book = mongoose.model('Book', bookSchema);

// POST 路由：保存书籍信息
app.post('/api/book', async (req, res) => {
  const { author, name, pages } = req.body;

  const book = new Book({ author, name, pages });
  await book.save();

  res.status(201).json(book);
});

// 启动服务器
const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
