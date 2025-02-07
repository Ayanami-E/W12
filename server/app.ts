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

// Define Book interface
interface IBook {
  author: string;
  name: string;
  pages: number;
}

// Create Book schema
const bookSchema = new mongoose.Schema<IBook>({
  author: { type: String, required: true },
  name: { type: String, required: true },
  pages: { type: Number, required: true }
}, {
  collection: 'books'
});

// MongoDB connection and model setup
const mongoURI = 'mongodb://localhost:27017/test';

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      // Try to create the collection if it doesn't exist
      await mongoose.connection.db.createCollection('books');
      console.log('Books collection created or already exists');
    } catch (err) {
      // Ignore error if collection already exists
      console.log('Collection setup completed');
    }
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Create Book model
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

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
