// client/src/App.tsx
import React, { useState } from 'react';

function App() {
  // 定义表单状态
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [message, setMessage] = useState('');

  // 表单提交处理函数
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    // 将 pages 转换为数字
    const pagesNumber = Number(pages);
    if (isNaN(pagesNumber)) {
      setMessage('Pages must be a number.');
      return;
    }

    const book = { name, author, pages: pagesNumber };

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      if (response.ok) {
        setMessage('Book saved successfully!');
        setName('');
        setAuthor('');
        setPages('');
      } else {
        setMessage('Error saving book.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error saving book.');
    }
  };

  return (
    <div>
      <h1>books</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Book Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="pages">Pages:</label>
          <input
            id="pages"
            type="number"
            value={pages}
            onChange={e => setPages(e.target.value)}
            required
          />
        </div>
        <div>
          <input id="submit" type="submit" value="Submit" />
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
