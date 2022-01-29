import Topbar from '@/comps/TopBar';
import React from 'react';
import { Circle, Icon, Tabs } from 'react-vant';
import { cls } from 'reactutils';
import styles from './index.module.less';

const data = {
  name: 1,
  img: 'http://kfqn.fushuhealth.com/picture/2022/01/17/23c7c4262df6457bac4701b581b6b87d_wm.jpg?e=1643034341&token=5tWU4jx332LnEkvTlzONEFO00KdRXQApLvLQGmIc:JygC_h56_WVkjaGA2AmGFdEXqI0=',
};

export default function App() {
  return (
    <div className={styles.box}>
      <Topbar title="训练报告" showBack={true} />
      <Card />
      <Result data={data} />
    </div>
  );
}

function Card(_data) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={styles.title}>
          <Icon name="coupon" size={18} />
          &nbsp; 医生回复
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>张医生</span>
          <span className={styles.v}>2021-08-09 12:33</span>
        </div>
        <div className={styles.kv}>
          <div className={styles.k}>临床描述</div>
        </div>
      </div>
    </div>
  );
}

function Result({ data }) {
  console.log('🚀 ~ file: index.tsx ~ line 43 ~ Result ~ data', data);
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={cls(styles.title, styles.nomb)}>
          <Icon name="coupon" size={18} />
          &nbsp; 训练结果
        </div>
        <Tabs active="b">
          <Tabs.TabPane title="进行中" name="a"></Tabs.TabPane>
          <Tabs.TabPane title="未开始" name="b"></Tabs.TabPane>
          <Tabs.TabPane title="已完成" name="c"></Tabs.TabPane>
        </Tabs>
        <img src={data?.img} alt="" />
        <div className={styles.circleBox}>
          <Circle
            rate={60}
            text="60%"
            strokeWidth={50}
            color={{
              '0%': '#366F9D',
              '100%': '#C33022',
            }}
          />
        </div>
      </div>
    </div>
  );
}
