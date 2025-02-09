import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const FRONTEND_PORT = 3000;
const BACKEND_PORT = 1234;

// 启用 CORS 以允许跨域请求，配置更详细
app.use(cors({
  origin: `http://localhost:${FRONTEND_PORT}`,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

// 连接到 MongoDB
const mongoURI = 'mongodb://localhost:27017/booksdb'; // 替换为你自己的 MongoDB 连接字符串
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// 创建 Book 模型
interface IBook {
  author: string;
  name: string;
  pages: number;
}

const bookSchema = new mongoose.Schema<IBook>({
  author: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  pages: { type: Number, required: true },
});

const Book = mongoose.model<IBook>('Book', bookSchema);

// POST 路由：保存书籍信息，防止重复
app.post('/api/book', async (req, res) => {
  const { author, name, pages } = req.body;
  try {
    const existingBook = await Book.findOne({ name });
    if (existingBook) {
      return res.status(403).json({ message: 'Book with this name already exists' });
    }
    const book = new Book({ author, name, pages });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ message: 'Failed to save book' });
  }
});

// GET 路由：获取所有书籍
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to retrieve books' });
  }
});

// GET 路由：按标题获取特定书籍
app.get('/api/book/:name', async (req, res) => {
  try {
    const book = await Book.findOne({ name: req.params.name });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Failed to retrieve book' });
  }
});

// 启动服务器
app.listen(BACKEND_PORT, () => {
  console.log(`Server running on http://localhost:${BACKEND_PORT}`);
});
