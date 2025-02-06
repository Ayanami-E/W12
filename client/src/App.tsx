// client/src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [author, setAuthor] = useState('');
  const [name, setName] = useState('');
  const [pages, setPages] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ author, name, pages }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Book added:', data);
    } else {
      console.error('Failed to add book');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div><h1>Books</h1><form onSubmit={handleSubmit}><input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} /><input type="text" placeholder="Book Name" value={name} onChange={(e) => setName(e.target.value)} /><input type="number" placeholder="Pages" value={pages} onChange={(e) => setPages(Number(e.target.value))} /><button type="submit">Add Book</button></form></div>} />
        <Route path="/book/:bookName" element={<div>Book Information</div>} />
        <Route path="*" element={<div>404: This is not the webpage you are looking for</div>} />
      </Routes>
    </Router>
  );
};

export default App;
