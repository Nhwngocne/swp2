// main.jsx (Vite)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // hoặc App nếu bạn export default AppContent
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
  