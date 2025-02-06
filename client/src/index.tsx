import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import the App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // This connects your React app to the root div in the HTML
);
