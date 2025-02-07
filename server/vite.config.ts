const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bookstore', { useNewUrlParser: true, useUnifiedTopology: true });

const Book = mongoose.model('Book', new mongoose.Schema({
  author: String,
  name: String,
  pages: Number,
}));
app.post('/api/book', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Error saving book', error });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 1234');
});
