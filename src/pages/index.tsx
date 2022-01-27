import Video from '@/comps/Video';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';

function App() {
  const [count] = useState<number>(1);
  const navigate = useNavigate();
  const jump = () => {
    navigate('/login');
  };

  return (
    <div className="App">
      <Video sources={[{src:"http://kfqn.fushuhealth.com/video/2022/01/12/1964cb483c154aad94e728017d5c54b2/1641957586632_ca903850aa0a4ba8bbb16f79d5aa4cb2_469295507.m3u8?pm3u8%2F0%2Fexpires%2F43200&e=1643119846&token=5tWU4jx332LnEkvTlzONEFO00KdRXQApLvLQGmIc:U7dmXCxF21qJQQ5i5UyRrDSU-nM="}]}></Video>

      <header className="App-header">
        <p className="header">
          🚀 Vite + React + Typescript 🤘 & <br />
          Eslint 🔥+ Prettier
        </p>

        <div className="body">
          <button onClick={jump} className={styles.btn}>
            🪂 Click me : {count}
          </button>

          <p> Don&apos;t forgot to install Eslint and Prettier in Your Vscode.</p>

          <p>
            Mess up the code in <code>App.tsx </code> and save the file.
          </p>
          <p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer">
              Learn React
            </a>
            {' | '}
            <a
              className="App-link"
              href="https://vitejs.dev/guide/features.html"
              target="_blank"
              rel="noopener noreferrer">
              Vite Docs
            </a>
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
