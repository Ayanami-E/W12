import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

// 设置默认环境为 development
process.env.NODE_ENV = 'development';

// 配置 CORS 以允许从 React 应用（端口3000）的请求
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// 连接到 MongoDB
const mongoURI = 'mongodb://localhost:27017/test';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// 创建 Book 模型
const bookSchema = new mongoose.Schema({
  author: String,
  name: String,
  pages: Number,
}, {
  collection: 'books'  // 明确指定集合名称
});

const Book = mongoose.model('Book', bookSchema);

// POST 路由：保存书籍信息
app.post('/api/book', async (req, res) => {
  const { author, name, pages } = req.body;

  try {
    const book = new Book({ author, name, pages });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ message: 'Failed to save book' });
  }
});

// 修改端口为 1234
const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
