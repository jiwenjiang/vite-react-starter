import Topbar from '@/comps/TopBar';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-vant';
import styles from './feelList.module.less';

const list = [
  '改良版幼儿孤独症筛查量表（M-CHAT-R）',
  '克氏孤独症行为量表 （CABS）',
  '自闭症行为量表（ABC）',
  '儿童自闭症评定量表(CARS)',
];

export default function App() {
  const navigate = useNavigate();

  const nav = (i) => {
    navigate(`/evaluate/feel?code=${i}`);
  };

  return (
    <div className={styles.box}>
      <Topbar title="儿童自闭症" />
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
