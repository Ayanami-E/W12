import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb://localhost:27017/booksdb';  // MongoDB connection
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const bookSchema = new mongoose.Schema({
  author: String,
  name: String,
  pages: Number,
});

const Book = mongoose.model('Book', bookSchema);

// Route for getting a book by its name
app.get('/api/book/:bookName', async (req, res) => {
  const { bookName } = req.params;
  try {
    const book = await Book.findOne({ name: bookName });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error });
  }
});

// POST route to add a book
app.post('/api/book', async (req, res) => {
  const { author, name, pages } = req.body;
  try {
    const book = new Book({ author, name, pages });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save book', error });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
