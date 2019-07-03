import React from 'react';
import './App.css';
import Home from './components/Home';

function App() {
  return (
    <Home url={'/assault/assault.json'} />
  );
}

export default App;
