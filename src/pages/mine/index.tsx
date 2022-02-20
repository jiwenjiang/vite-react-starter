import FTabbar from '@/comps/Tabbar';
import Topbar from '@/comps/TopBar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-vant';
import styles from './index.module.less';

export default function App() {
  return (
    <div className={styles.box}>
      <Topbar title="个人资料" />
      <Card />
      <FTabbar />
    </div>
  );
}

function Card() {
  const [data, setData] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.user) {
      const user = JSON.parse(sessionStorage.user);
      setData(user);
    } else {
      navigate('/login');
    }
  }, []);
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={styles.title}>
          <Icon name="coupon" size={18} />
          &nbsp; 平衡性训练
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>姓名</span>
          <span className={styles.v}>{data.name}</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>性别</span>
          <span className={styles.v}>
            {data.gender === 1 ? '男' : data.gender === 2 ? '女' : '未知'}
          </span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>年龄</span>
          <span className={styles.v}>{data.age}</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>手机号</span>
          <span className={styles.v}>{data.phone}</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>训练次数</span>
          <span className={styles.v}>{data.trainedCount}</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>课程数量</span>
          <span className={styles.v}>{data.trainedPlan}</span>
        </div>
      </div>
    </div>
  );
}
