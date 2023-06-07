// Importing neccessary libraries and classes
import React from 'react';
import ReactDOM from 'react-dom/client';
import "antd/dist/reset.css";
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

// This file will be called as the structure of our website

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>

);