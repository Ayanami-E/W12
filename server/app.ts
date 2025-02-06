// server/app.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/bookstore');
    
    const db = mongoose.connection.db;
    try {
      await db.createCollection('books');
    } catch (err: any) { 
      if (err.code !== 48) { // 忽略集合已存在的错误
        throw err;
      }
    }
    
    console.log('Successfully connected to MongoDB.');
  } catch (err: any) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

const bookSchema = new mongoose.Schema({
  author: { type: String, required: true },
  name: { type: String, required: true },
  pages: { type: Number, required: true }
});

const Book = mongoose.model('Book', bookSchema);

app.post('/api/book', async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(200).json(savedBook);
  } catch (err) {
    res.status(500).json({ error: 'Error saving book' });
  }
});

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default app;
