import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Course from './pages/course';
import Detail from './pages/detail';
import Login from './pages/login';
import Mine from './pages/mine';
import Password from './pages/password';
import Records from './pages/records';
import Report from './pages/report';
import Transition from './pages/transition';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Transition />} />
        <Route path="login" element={<Login />} />
        <Route path="password" element={<Password />} />
        <Route path="course" element={<Course />} />
        <Route path="records" element={<Records />} />
        <Route path="report/:id" element={<Report />} />
        <Route path="courseDetail/:id" element={<Detail />} />
        <Route path="mine" element={<Mine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
