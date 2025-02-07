import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

// Enable CORS for development mode
if (process.env.NODE_ENV === 'development') {
  const corsOptions = {
    origin: 'http://localhost:5173',  // Allow frontend on port 5173 (Vite's default port)
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

app.use(bodyParser.json());

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/booksdb';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);  // Exit the process if connection fails
  });

// Book model
const bookSchema = new mongoose.Schema({
  author: String,
  name: String,
  pages: Number,
});

const Book = mongoose.model('Book', bookSchema);

// POST route to save book info
app.post('/api/book', async (req, res) => {
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

// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
