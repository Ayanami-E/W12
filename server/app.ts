import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/bookstore')
  .then(async () => {
    const db = mongoose.connection.db;
    if (!(await db.listCollections({ name: 'books' }).hasNext())) {
      await db.createCollection('books');
    }
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

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

export default app;
