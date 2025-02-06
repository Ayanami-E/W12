// server/app.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(cors());

// 连接 MongoDB 和创建集合
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/bookstore');
    
    // 确保 books 集合存在
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (!collections.some(c => c.name === 'books')) {
      await mongoose.connection.db.createCollection('books');
    }
    
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// 执行连接
connectDB();

// Book Schema 显式指定集合名称
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

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

export default app;