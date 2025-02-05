import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// 开发环境下启用CORS
if (process.env.NODE_ENV === 'development') {
  const corsOptions = {
    origin: 'http://localhost:3000', // 允许来自http://localhost:3000的请求
    optionsSuccessStatus: 200, // 设置成功状态码
  };
  app.use(cors(corsOptions)); // 启用CORS
}

app.use(express.json());

// MongoDB连接和创建集合的代码
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/bookstore');
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// 执行连接
connectDB();

// Book Schema 定义和接口路由
const bookSchema = new mongoose.Schema({
  author: { type: String, required: true },
  name: { type: String, required: true },
  pages: { type: Number, required: true }
}, { collection: 'books' });

const Book = mongoose.model('Book', bookSchema);

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
