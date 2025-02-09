import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import mongoose, { Schema, Document } from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const BACKEND_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 1234;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booksdb';
const FRONTEND_PORT = process.env.FRONTEND_PORT ? parseInt(process.env.FRONTEND_PORT, 10) : 3000;

const app = express();
app.use(morgan('dev'));

if (NODE_ENV === 'development') {
  const corsOptions: CorsOptions = {
    origin: `http://localhost:${FRONTEND_PORT}`,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

interface IBook extends Document {
  name: string;   // 书名
  author: string; // 作者
  pages: number;  // 页数
}

const bookSchema: Schema<IBook> = new Schema({
  name:   { type: String, required: true, unique: true },
  author: { type: String, required: true },
  pages:  { type: Number, required: true },
});

const Book = mongoose.model<IBook>('Book', bookSchema);

/**
 * 1. POST /api/book -- 添加单本书籍
 */
app.post('/api/book', async (req: Request, res: Response) => {
  try {
    const { name, author, pages } = req.body;
    // 检查是否已存在同名书籍
    const existingBook = await Book.findOne({ name });
    if (existingBook) {
      return res.status(409).json({ message: 'Book with the same name already exists.' });
    }
    const newBook = new Book({ name, author, pages });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ message: 'Failed to save book' });
  }
});

/**
 * 2. POST /api/books -- 批量添加多本书籍
 *    请求体示例: { books: [{ name, author, pages }, { name, author, pages }, ...] }
 */
app.post('/api/books', async (req: Request, res: Response) => {
  try {
    const { books } = req.body; // books 是一个数组
    if (!Array.isArray(books)) {
      return res.status(400).json({ message: 'Invalid data, "books" must be an array' });
    }

    // 可批量插入
    // 如果要检查每一本是否重复，可遍历逐本检查
    const inserted = await Book.insertMany(books);
    // insertMany 默认不会抛错，如果有重复 unique，只会失败
    res.status(201).json(inserted);
  } catch (error: any) {
    console.error('Error saving multiple books:', error);
    // 如果是 unique 冲突，可以自定义返回 409 或者 400
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Some books already exist' });
    }
    res.status(500).json({ message: 'Failed to save books' });
  }
});

/**
 * 3. GET /api/book/:title -- 根据书名获取单本书籍
 */
app.get('/api/book/:title', async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    const book = await Book.findOne({ name: title });
    if (!book) {
      return res.status(404).json({ message: `Book with name "${title}" not found` });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book by title:', error);
    res.status(500).json({ message: 'Failed to retrieve book' });
  }
});

app.listen(BACKEND_PORT, () => {
  console.log(`Server running at http://localhost:${BACKEND_PORT}`);
});
