import request from '@/service/request';
import { GetQueryString } from '@/service/utils';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// const handleUrl = () => {
//     const baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
//     const data = {
//       appid: 'wxf642fb7b35c55f30',
//       redirect_uri: window.location.href,
//       //   redirect_uri: 'http://wx-test.fushuhealth.com',
//       response_type: 'code',
//       scope: 'snsapi_base',
//       state: 1,
//     };
//     const list = [];
//     for (const key in data) {
//       let str = `${key}=${data[key]}`;
//       list.push(str);
//     }
//     const query = list.join('&');
//     return `${baseUrl}?${query}#wechat_redirect`;
//   };

`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf642fb7b35c55f30&redirect_uri=http%3A%2F%2Fwx-test.fushuhealth.com%2F&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect`;

function App() {
  const navigate = useNavigate();

  const auth = async () => {
    const res = await request({
      url: '/getOpenId',
      data: { code: GetQueryString('code') },
      needLogin: false,
    });
    if (res.data?.openId) {
      const checkId = await request({
        url: '/wxLogin',
        data: { openId: res.data?.openId },
        needLogin: false,
      });
      if (checkId.code === 0) {
        sessionStorage.user = JSON.stringify(checkId.data.user);
        sessionStorage.token = checkId.data.token;
        navigate('/records');
      }
      if (checkId.code === 2) {
        navigate(`/login?openId=${res.data?.openId}`);
      }
    }
  };

  useEffect(() => {
    let code = GetQueryString('code');
    if (!code) {
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf642fb7b35c55f30&redirect_uri=http%3A%2F%2Fwx-test.fushuhealth.com%2F&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect`;
    } else {
      auth();
    }
  }, []);

  return <div></div>;
}

export default App;