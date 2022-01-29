import FTabbar from '@/comps/Tabbar';
import Topbar from '@/comps/TopBar';
import VList from '@/comps/VList';
import React, { useEffect, useState } from 'react';
import { Tabs } from 'react-vant';
import styles from './index.module.less';

const data = [
  {
    name: 1,
    img: 'http://kfqn.fushuhealth.com/picture/2022/01/17/23c7c4262df6457bac4701b581b6b87d_wm.jpg?e=1643034341&token=5tWU4jx332LnEkvTlzONEFO00KdRXQApLvLQGmIc:JygC_h56_WVkjaGA2AmGFdEXqI0=',
  },
];

export default function App() {
  const [height, setHeight] = useState(600);
  // const [loadingText, setLoadingText] = useState('正在加载中');

  const onLoad = () => {
    console.log('load');
  };

  useEffect(() => {
    const h = document.body.offsetHeight - 145;
    setHeight(h);
  }, []);
  return (
    <div className={styles.box}>
      <Topbar title="训练课程" />
      <Tabs active="b">
        <Tabs.TabPane title="进行中" name="a"></Tabs.TabPane>
        <Tabs.TabPane title="未开始" name="b"></Tabs.TabPane>
        <Tabs.TabPane title="已完成" name="c"></Tabs.TabPane>
      </Tabs>
      <VList
        renderFn={(d) => Card(d)}
        data={data}
        itemSize={371}
        height={height}
        onLoad={onLoad}
      />
      <FTabbar />
    </div>
  );
}

function Card(data) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <img src={data?.img} alt="" />
        <div className={styles.title}>平衡性训练</div>
        <div className={styles.kv}>
          <span className={styles.k}>训练动作</span>
          <span className={styles.v}>共10个</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>训练时间</span>
          <span className={styles.v}>2021-01-01 至 2021-01-30</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>每周训练</span>
          <span className={styles.v}>周一，周二，周五</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>训练目的</span>
          <span className={styles.v}>提高平衡性</span>
        </div>
      </div>
    </div>
  );
}
