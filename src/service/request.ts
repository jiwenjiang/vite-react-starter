import { Notify } from 'react-vant';

const baseUrl = `http://platform-test.fushuhealth.com/recovery-wx`;

type httpType = {
  url: string;
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT';
  data?: any;
  [key: string]: any;
};

const handleOps = ({ url, method = 'GET', data, ...options }: httpType) => {
  const token = sessionStorage.token;
  if (method === 'GET') {
    const list = [];
    for (const key in data) {
      let str = `${key}=${data[key]}`;
      list.push(str);
    }
    const query = list.join('&');
    const allUrl = `${baseUrl}${url}?${query}`;
    const ops = {
      ...options,
      headers: {
        'recovery-token': token ?? '',
      },
    };
    return {
      url: allUrl,
      options: ops,
    };
  }
  if (['DELETE', 'POST', 'PUT'].includes(method)) {
    const allUrl = `${baseUrl}${url}`;
    const ops = {
      ...options,
      method,
      headers: {
        'Content-Type': 'application/json',
        'recovery-token': token ?? '',
      },
      body: JSON.stringify(data),
    };
    return {
      url: allUrl,
      options: ops,
    };
  }
};

const request = async (params: httpType) => {
  const { url, options } = handleOps(params);

  const res = await fetch(url, options);
  const data = await res.json();
  if (data && !data.success) {
    if (data.code === 2) {
      sessionStorage.token = '';
      sessionStorage.user = '';
      window.location.pathname = '/login';
    }
    Notify.show({ type: 'danger', message: data.message });
  }
  return data;
};

export default request;