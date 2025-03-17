import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'; 
import './index.css';
import App from './App.jsx';

const store = configureStore({
  reducer: {
    
  }
  });

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <App />
  </Provider>,
)
