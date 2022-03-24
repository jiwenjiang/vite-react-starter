import FTabbar from '@/comps/Tabbar';
import Topbar from '@/comps/TopBar';
import yonghuImg from '@/static/imgs/yonghu.jpg';
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
  const list = [
    { name: '自测量表记录', url: '/evaluate/list' },
    { name: '修改密码', url: '/password' },
  ];

  useEffect(() => {
    if (sessionStorage.user) {
      const user = JSON.parse(sessionStorage.user);
      setData(user);
    } else {
      navigate('/login');
    }
  }, []);

  const toPsw = () => {
    navigate('/password');
  };

  const nav = (v) => {
    navigate(v.url);
  };

  return (
    <>
      <div className={styles.cardBox}>
        <div className={styles.card}>
          <div className={styles.title}>
            <img src={yonghuImg} alt="1" />
            &nbsp; 用户详情
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
        {/* <div className={styles.psw} onClick={toPsw}>
          修改密码
        </div> */}
      </div>
      <div className={styles.listCard}>
        {list?.map((v, i) => (
          <div key={i}>
            <div className={styles.listBox} onClick={() => nav(v)}>
              <div className={styles.listTitle}>{v.name}</div>
              <Icon name="arrow" className={styles.arrow} />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.listCard}>
        <div className={styles.listBox} style={{ borderBottom: 'none' }}>
          <div className={styles.listTitle}>解绑微信</div>
          <Icon name="arrow" className={styles.arrow} />
        </div>
      </div>
    </>
  );
}
