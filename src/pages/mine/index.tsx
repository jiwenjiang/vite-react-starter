import FTabbar from '@/comps/Tabbar';
import Topbar from '@/comps/TopBar';
import React, { useEffect, useState } from 'react';
import { Icon } from 'react-vant';
import styles from './index.module.less';

export default function App() {
  const [height, setHeight] = useState(600);

  const onLoad = () => {
    console.log('load');
  };

  useEffect(() => {
    const h = document.body.offsetHeight - 145;
    console.log('🚀 ~ file: index.tsx ~ line 14 ~ useEffect ~ h', h);
    setHeight(h);
  }, []);
  return (
    <div className={styles.box}>
      <Topbar title="个人资料" />
      <Card />
      <FTabbar />
    </div>
  );
}

function Card(data) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={styles.title}>
          <Icon name="coupon" size={18}/>&nbsp;
          平衡性训练
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>姓名</span>
          <span className={styles.v}>共10个</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>性别</span>
          <span className={styles.v}>2021-01-01 至 2021-01-30</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>年龄</span>
          <span className={styles.v}>周一，周二，周五</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>手机号</span>
          <span className={styles.v}>提高平衡性</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>训练次数</span>
          <span className={styles.v}>提高平衡性</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>课程数量</span>
          <span className={styles.v}>提高平衡性</span>
        </div>
      </div>
    </div>
  );
}
