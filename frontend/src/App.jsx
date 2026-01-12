import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProblemDetail from './components/ProblemDetail'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/problem/:id" element={<ProblemDetail />} />
      </Routes>
    </Router>
  );
}
export default App;