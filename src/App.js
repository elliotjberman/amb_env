import React from 'react';
import './App.css';
import Home from './components/Home';

function App() {
  return (
    <Home url={'/stress_test/stress_test.json'} />
  );
}

export default App;
