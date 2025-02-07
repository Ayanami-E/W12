import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

// Enable CORS for development mode only
if (process.env.NODE_ENV === 'development') {
  const corsOptions = {
    origin: 'http://localhost:3000',  // React frontend port
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions)); // Use the cors middleware with the specified options
}

app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/booksdb';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Create Book model
const bookSchema = new mongoose.Schema({
  author: String,
  name: String,
  pages: Number,
}, {
  collection: 'books'  // Explicitly specify collection name
});

const Book = mongoose.model('Book', bookSchema);

// POST route to save book information
app.post('/api/book', async (req, res) => {
  const { author, name, pages } = req.body;

  try {
    const book = new Book({ author, name, pages });
    await book.save();
    res.status(201).json(book); // Return the created book data
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ message: 'Failed to save book' });
  }
});

// Start the server on port 1234
const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
