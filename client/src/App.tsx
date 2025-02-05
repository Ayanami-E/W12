import React, { useState } from 'react';

function App() {
  const [author, setAuthor] = useState('');
  const [name, setName] = useState('');
  const [pages, setPages] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, name, pages: Number(pages) }),
    });
    const data = await response.json();
    console.log('Book saved:', data);
  };

  return (
    <div>
      <h1>Books App</h1>
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
        onChange={(e) => setPages(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;
