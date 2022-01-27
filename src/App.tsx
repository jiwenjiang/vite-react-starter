import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Course from './pages/course';
import Home from './pages/index';
import Login from './pages/login';
import Mine from './pages/mine';
import Records from './pages/records';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="course" element={<Course />} />
        <Route path="records" element={<Records />} />
        <Route path="mine" element={<Mine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
