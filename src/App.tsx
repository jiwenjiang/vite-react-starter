import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Loading } from 'react-vant';

const Course = lazy(() => import('./pages/course'));
const Login = lazy(() => import('./pages/login'));
const Detail = lazy(() => import('./pages/detail'));
const Mine = lazy(() => import('./pages/mine'));
const Password = lazy(() => import('./pages/password'));
const Records = lazy(() => import('./pages/records'));
const Report = lazy(() => import('./pages/report'));
const Transition = lazy(() => import('./pages/transition'));
const Baseinfo = lazy(() => import('./pages/evaluate/baseinfo'));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100vw',
              height: '100vh',
            }}>
            <Loading type="spinner" />
          </div>
        }>
        <Routes>
          <Route path="/" element={<Transition />} />
          <Route path="login" element={<Login />} />
          <Route path="password" element={<Password />} />
          <Route path="course" element={<Course />} />
          <Route path="records" element={<Records />} />
          <Route path="report/:id" element={<Report />} />
          <Route path="courseDetail/:id" element={<Detail />} />
          <Route path="mine" element={<Mine />} />
          <Route path="baseinfo" element={<Baseinfo />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
