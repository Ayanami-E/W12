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
const mongoURI = 'mongodb://localhost:27017/test';

// Initialize database and ensure collection exists
async function initializeDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Explicitly create books collection in database
    try {
      await mongoose.connection.db.createCollection('books');
      console.log('Books collection created or already exists');
    } catch (err) {
      // Collection might already exist, which is fine
      console.log('Collection setup complete');
    }

    // Insert a dummy document to ensure collection exists
    const dummyDoc = { author: 'temp', name: 'temp', pages: 0 };
    await mongoose.connection.db.collection('books').insertOne(dummyDoc);
    await mongoose.connection.db.collection('books').deleteOne(dummyDoc);
    
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
}

// Initialize database
initializeDatabase();

// Define interfaces
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
