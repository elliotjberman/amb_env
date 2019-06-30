import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home';

function App() {
  return (
    <Home url={'/tim_test.json'} />
  );
}

export default App;
