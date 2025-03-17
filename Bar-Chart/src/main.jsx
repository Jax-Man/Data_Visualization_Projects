import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'; 
import './index.css';
import App from './App.jsx';

import dataReducer from './features/data.jsx'

const store = configureStore({
  reducer: {
    data: dataReducer
  }
  });

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <App />
  </Provider>,
)
