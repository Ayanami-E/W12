import React, { useState } from 'react';

const AddBookForm = () => {
  // State to manage input values
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent the default form submission behavior

    // Prepare the data to send
    const bookData = {
      name: bookName,
      author: author,
      pages: parseInt(pages, 10),
    };

    try {
      // Send POST request to the backend API
      const response = await fetch('http://localhost:1234/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const savedBook = await response.json();
        console.log('Book saved:', savedBook);
        // Optionally reset form or display a success message
      } else {
        console.error('Failed to save book');
      }
    } catch (error) {
      console.error('Error during request:', error);
    }
  };

  return (
    <div>
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bookName">Book Name:</label>
          <input
            id="bookName"
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="pages">Pages:</label>
          <input
            id="pages"
            type="number"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddBookForm;
