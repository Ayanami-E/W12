import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// 设置默认环境为 development
process.env.NODE_ENV = 'development';

const app = express();

// Configure CORS for development environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/test';

// Define interfaces
interface IBook {
  author: string;
  name: string;
  pages: number;
}

// Create Book schema ONCE
const bookSchema = new mongoose.Schema<IBook>({
  author: { type: String, required: true },
  name: { type: String, required: true },
  pages: { type: Number, required: true }
}, {
  collection: 'books'
});

// Create the model ONCE
const Book = mongoose.model<IBook>('Book', bookSchema);

// Initialize database and ensure collection exists
async function initializeDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Try to create collection directly using connection
    await mongoose.connection.db.createCollection('books')
      .catch(() => console.log('Collection might already exist'));

  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Initialize database
initializeDatabase();

// POST route to save book
app.post('/api/book', async (req: Request, res: Response) => {
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

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
