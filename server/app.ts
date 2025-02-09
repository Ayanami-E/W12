import express from 'express';
import cors, { CorsOptions } from 'cors';
import mongoose, { Schema, Document } from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const FRONTEND_PORT = 3000;
const BACKEND_PORT = 1234;

if (process.env.NODE_ENV === 'development') {
  const corsOptions: CorsOptions = {
    origin: `http://localhost:${FRONTEND_PORT}`,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

app.use(bodyParser.json());

// 连接到 MongoDB
const mongoURI = 'mongodb://localhost:27017/booksdb'; // 替换为你自己的 MongoDB 连接字符串
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// 创建 Book 模型
interface IBook extends Document {
  name: string;
  author: string;
  pages: number;
}

const bookSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true },
});

const Book = mongoose.model<IBook>('Book', bookSchema);

// POST 路由：保存书籍信息
app.post('/api/book', async (req, res) => {
  const { name, author, pages } = req.body;
  try {
    const book = new Book({ name, author, pages });
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

// 启动服务器
app.listen(BACKEND_PORT, () => {
  console.log(`Server running on http://localhost:${BACKEND_PORT}`);
});
