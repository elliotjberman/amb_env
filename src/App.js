import React from 'react';
import './App.css';
import Home from './components/Home';

function App() {
  return (
    <Home url={'/reich/reich.json'} />
  );
}

export default App;
