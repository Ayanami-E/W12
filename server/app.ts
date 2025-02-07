import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 连接到 MongoDB 并初始化
const init = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/bookstore');
    const db = mongoose.connection.db;
    
    // 确保 books 集合存在
    const collections = await db.listCollections().toArray();
    if (!collections.some(c => c.name === 'books')) {
      await db.createCollection('books');
    }
    
    console.log('Successfully connected to MongoDB.');
  } catch (err: any) {
    if (err.code !== 48) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  }
};

init();

// Book 模型
const bookSchema = new mongoose.Schema({
  author: { type: String, required: true },
  name: { type: String, required: true },
  pages: { type: Number, required: true }
}, { collection: 'books' });

const Book = mongoose.model('Book', bookSchema);

// POST 路由
app.post('/api/book', async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(200).json(savedBook);
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ error: 'Error saving book' });
  }
});

// 启动服务器
const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 错误处理
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

// 进程退出处理
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default app;
