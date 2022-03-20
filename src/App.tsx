import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Loading } from 'react-vant';
import request from './service/request';

const Course = lazy(() => import('./pages/course'));
const Login = lazy(() => import('./pages/login'));
const Detail = lazy(() => import('./pages/detail'));
const Mine = lazy(() => import('./pages/mine'));
const Password = lazy(() => import('./pages/password'));
const Records = lazy(() => import('./pages/records'));
const Report = lazy(() => import('./pages/report'));
const Transition = lazy(() => import('./pages/transition'));
const Grow = lazy(() => import('./pages/evaluate/grow'));
const GrowDetail = lazy(() => import('./pages/evaluate/growDetail'));
const FeelList = lazy(() => import('./pages/evaluate/feelList'));
const Feel = lazy(() => import('./pages/evaluate/feel'));
const FeelDetail = lazy(() => import('./pages/evaluate/feelDetail'));
const Zibizheng = lazy(() => import('./pages/evaluate/zibizheng'));

function App() {
  const wxConfig = async () => {
    const res = await request({
      url: '/js/signature',
      data: { url: window.location.href },
      needLogin: false,
    });
    const { appId, nonceStr, signature, timestamp } = res.data;
    window.wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId, // 必填，公众号的唯一标识
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名
      jsApiList: [
        'chooseImage',
        'uploadImage',
        'downloadImage',
        'startRecord',
        'stopRecord',
        'playVoice',
        'stopVoice',
        'uploadVoice',
      ], // 必填，需要使用的JS接口列表
    });
    window.wx.error(function (res) {
      console.log('🚀 ~ file: App.tsx ~ line 34 ~ window.wx.error ~ res', res);
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    });
    window.wx.ready(function () {
      console.log('----------------------------------');
      // console.log('wxready!!!', window.wx);
    });
  };
  useEffect(() => {
    wxConfig();
  }, []);
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
          <Route path="evaluate">
            <Route path="grow" element={<Grow />} />
            <Route path="growDetail/:id" element={<GrowDetail />} />
            <Route path="feelList" element={<FeelList />} />
            <Route path="feel" element={<Feel />} />
            <Route path="feelDetail/:id" element={<FeelDetail />} />
            <Route path="zibizheng/:id" element={<Zibizheng />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
