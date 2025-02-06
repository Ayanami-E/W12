import React from 'react';
import AddBookForm from '../server/AddBookForm'; // Import from server folder as per your structure

function App() {
  return (
    <div className="App">
      <h1>Bookstore</h1>
      <AddBookForm /> {/* This renders the form */}
    </div>
  );
}

export default App;
