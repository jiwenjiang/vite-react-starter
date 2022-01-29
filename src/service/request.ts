const baseUrl = `http://platform-test.fushuhealth.com/recovery-wx`;

type httpType = {
  url: string;
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT';
  data?: any;
  [key: string]: any;
};

const handleOps = ({ url, method = 'GET', data, ...options }: httpType) => {
  if (method === 'GET') {
    const list = [];
    for (const key in data) {
      let str = `${key}=${data[key]}`;
      list.push(str);
    }
    const query = list.join('&');
    const allUrl = `${baseUrl}${url}?${query}`;
    return {
      url: allUrl,
      options,
    };
  }
  if (['DELETE', 'POST', 'PUT'].includes(method)) {
    const allUrl = `${baseUrl}${url}`;
    const ops = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      //   mode: 'no-cors',
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
  console.log('🚀 ~ file: request.ts ~ line 43 ~ request ~ options', options);

  const res = await fetch(url, options);
  return res.json();
};

export default request;
