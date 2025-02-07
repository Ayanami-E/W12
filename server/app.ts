// server/app.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

// 启用 CORS 以允许跨域请求
app.use(cors());
app.use(bodyParser.json());

// 连接到 MongoDB
const mongoURI = 'mongodb://localhost:27017/booksdb';  // 替换为你自己的 MongoDB 连接字符串
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // 连接失败时退出程序
  });

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

  try {
    const book = new Book({ author, name, pages });
    await book.save();
    res.status(201).json(book);  // 返回成功创建的书籍数据
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ message: 'Failed to save book' });
  }
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
