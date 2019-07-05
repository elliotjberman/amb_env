import React from 'react';
import './App.css';
import Home from './components/Home';

function App() {
  return (
    <Home url={'/bodo/bodo.json'} />
  );
}

export default App;
