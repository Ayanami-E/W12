import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

function BookList() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/books')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch(() => setError('Failed to fetch books'));
  }, []);

  return (
    <div>
      <h1>Book List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <Link to={`/book/${encodeURIComponent(book.name)}`}>{book.name} by {book.author}</Link>
          </li>
        ))}
      </ul>
      <Link to="/add">Add a new book</Link>
    </div>
  );
}

function BookDetails() {
  const { bookName } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/book/${bookName}`)
      .then((response) => {
        if (!response.ok) throw new Error('Book not found');
        return response.json();
      })
      .then((data) => setBook(data))
      .catch(() => setError('Failed to fetch book details'));
  }, [bookName]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <h1>{book.name}</h1>
      <p>Author: {book.author}</p>
      <p>Pages: {book.pages}</p>
      <Link to="/">Back to Book List</Link>
    </div>
  );
}

function AddBook() {
  const [author, setAuthor] = useState('');
  const [name, setName] = useState('');
  const [pages, setPages] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    const bookData = { author, name, pages };

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        setSuccess('Book added successfully!');
        setTimeout(() => navigate(`/book/${encodeURIComponent(name)}`), 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error adding book');
      }
    } catch (error) {
      setError('Failed to add book');
    }
  };

  return (
    <div>
      <h1>Add a New Book</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Book Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Pages"
          value={pages}
          onChange={(e) => setPages(Number(e.target.value))}
        />
        <button type="submit">Add Book</button>
      </form>
      <Link to="/">Back to Book List</Link>
    </div>
  );
}

function NotFound() {
  return <h1>404 - This is not the webpage you are looking for.</h1>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/book/:bookName" element={<BookDetails />} />
        <Route path="/add" element={<AddBook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
