import React, { useState, useEffect } from 'react';

function App() {
  const [author, setAuthor] = useState('');
  const [name, setName] = useState('');
  const [pages, setPages] = useState(0);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 获取所有书籍
  useEffect(() => {
    fetch('http://localhost:1234/api/books')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((err) => setError('Failed to fetch books'));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    const bookData = { author, name, pages };

    try {
      const response = await fetch('http://localhost:1234/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess('Book added successfully!');
        setBooks([...books, result]); // 更新书籍列表
        setAuthor('');
        setName('');
        setPages(0);
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
      <h1>Books</h1>
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

      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book._id}>{book.name} by {book.author} - {book.pages} pages</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
