import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

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
const DB_NAME = 'booksdb'; // 使用指定的数据库名称
const mongoURI = `mongodb://localhost:27017/${DB_NAME}`;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define Book interface
interface IBook {
  author: string;
  name: string;
  pages: number;
}

// Create Book schema with specific collection name
const bookSchema = new mongoose.Schema<IBook>({
  author: { type: String, required: true },
  name: { type: String, required: true },
  pages: { type: Number, required: true }
}, {
  collection: 'books' // 明确指定集合名称为 'books'
});

const Book = mongoose.model<IBook>('Book', bookSchema);

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

// GET route to fetch a specific book by name
app.get('/api/book/:name', async (req: Request, res: Response) => {
  try {
    const book = await Book.findOne({ name: req.params.name });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Failed to fetch book' });
  }
});

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
