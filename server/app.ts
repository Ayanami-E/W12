import express from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const PORT = 1234; // 后端端口

// 使用 bodyParser 解析请求体
app.use(bodyParser.json());

// 连接 MongoDB
// 你可以将 localhost 替换为其他主机或远程连接
const mongoURI = 'mongodb://localhost:27017/booksdb';
mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// 定义接口和 Schema（如果是 JS，去掉 interface）
interface IBook extends Document {
  name: string;
  author: string;
  pages: number;
}

const bookSchema: Schema = new Schema({
  name:   { type: String, required: true, unique: true },
  author: { type: String, required: true },
  pages:  { type: Number, required: true },
});

const Book = mongoose.model<IBook>('Book', bookSchema);

// POST 路由：保存书籍信息
app.post('/api/book', async (req, res) => {
  try {
    const { name, author, pages } = req.body;
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
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
