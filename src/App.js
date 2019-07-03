import React from 'react';
import './App.css';
import Home from './components/Home';

function App() {
  return (
    <Home url={'/overlapping-test.json'} />
  );
}

export default App;
