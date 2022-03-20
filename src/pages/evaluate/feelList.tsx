import Topbar from '@/comps/TopBar';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-vant';
import styles from './feelList.module.less';

const list = ['感统量表1', '感统量表2', '感统量表3', '感统量表4'];

export default function App() {
  const navigate = useNavigate();

  const nav = (i) => {
    navigate(`/evaluate/feel?code=${i}`);
  };

  return (
    <div className={styles.box}>
      <Topbar title="儿童发育里程碑评定结果" />
      {list.map((v, i) => (
        <div key={i}>
          <div className={styles.listBox} onClick={() => nav(i + 1)}>
            <div className={styles.listTitle}>{v}</div>
            <Icon name="arrow" className={styles.arrow} />
          </div>
        </div>
      ))}
    </div>
  );
}
