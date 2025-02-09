import React, { useState } from 'react';

function App() {
  const [author, setAuthor] = useState('');
  const [name, setName] = useState('');
  const [pages, setPages] = useState(0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const bookData = { author, name, pages };

    try {
      const response = await fetch('http://localhost:5173/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Book added:', result);
      } else {
        console.error('Error adding book');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Books</h1>
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
    </div>
  );
}

export default App;
