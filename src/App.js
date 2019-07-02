import React from 'react';
import './App.css';
import Home from './components/Home';

function App() {
  return (
    <Home url={'/volume_mod.json'} />
  );
}

export default App;
