import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';

function App() {
  const [books, setBooks] = useState([]);

  // Fetch books from the API
  useEffect(() => {
    async function fetchBooks() {
      const response = await fetch('/api/books');
      const data = await response.json();
      setBooks(data);
    }
    fetchBooks();
  }, []);

  return (
    <Router>
      <div>
        <h1>Books</h1>
        <nav>
          {books.map((book: any) => (
            <Link key={book._id} to={`/book/${book.name}`}>
              {book.name}
            </Link>
          ))}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:bookName" element={<BookDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <div>Welcome to the Books app!</div>;
}

function BookDetails() {
  const { bookName } = useParams();
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    async function fetchBookDetails() {
      const response = await fetch(`/api/book/${bookName}`);
      const data = await response.json();
      setBook(data);
    }
    fetchBookDetails();
  }, [bookName]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{book.name}</h2>
      <p>Author: {book.author}</p>
      <p>Pages: {book.pages}</p>
    </div>
  );
}

export default App;
