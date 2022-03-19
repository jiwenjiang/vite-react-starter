import Topbar from '@/comps/TopBar';
import Logo from '@/static/icons/logo.svg';
import React from 'react';
import { Icon } from 'react-vant';
import styles from './feelList.module.less';

const list = ['感统量表1', '感统量表2', '感统量表3', '感统量表4'];

export default function App() {
  return (
    <div className={styles.box}>
      <Topbar title="儿童发育里程碑评定结果" />
      {list.map((v, i) => (
        <div key={i}>
          <div className={styles.listBox}>
            <div className={styles.listTitle}>
              {v}
              <Logo />
            </div>
            <Icon name="arrow" className={styles.arrow} />
          </div>
        </div>
      ))}
    </div>
  );
}
