import fetcher from '@/service/fetcher';
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-vant/lib/index.css';
import { SWRConfig } from 'swr';
import App from './App';
import './index.less';

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        fetcher,
      }}>
      <App />
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById('root'),
);
