import React from 'react';
import './App.css';
import Home from './components/Home';

function App() {
  return (
    <Home url={'/polynesian_nightmare.json'} />
  );
}

export default App;
