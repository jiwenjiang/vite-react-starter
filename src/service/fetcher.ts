const baseUrl = `http://platform-test.fushuhealth.com/recovery-wx`;
const fetcher = (params, a) => {
  console.log('args', params, a);
  return fetch({ ...params, url: `${baseUrl}${params.url}` }).then((res) => res.json());
};

export default fetcher;
