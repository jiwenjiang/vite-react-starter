import Topbar from '@/comps/TopBar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-vant';
import styles from './feelList.module.less';

export default function App() {
  return (
    <div className={styles.box}>
      <Topbar title="儿童发育里程碑评定结果" />
      <Card />
    </div>
  );
}

function ListItem(v) {
  return (
    <div className={styles.listBox}>
      <div className={styles.listTitle}>
        {v.doctorName}回复了{v.trainingTime}的{v.planName}
      </div>
      <div className={styles.listDesc}>{v.created}</div>
      <Icon name="arrow" className={styles.arrow} />
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
    <>
      <div className={styles.cardBox}>
        <div className={styles.card}>
          <div className={styles.title}>
            <Icon name="coupon" size={18} />
            &nbsp; 基本信息
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>昵称</span>
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
            <span className={styles.k}>年龄段</span>
            <span className={styles.v}>{data.phone}</span>
          </div>
        </div>
      </div>
    </>
  );
}
