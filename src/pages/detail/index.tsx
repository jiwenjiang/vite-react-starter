import Topbar from '@/comps/TopBar';
import React from 'react';
import { Icon, Tag } from 'react-vant';
import { cls } from 'reactutils';
import styles from './index.module.less';

const data = {
  name: 1,
  img: 'http://kfqn.fushuhealth.com/picture/2022/01/17/23c7c4262df6457bac4701b581b6b87d_wm.jpg?e=1643034341&token=5tWU4jx332LnEkvTlzONEFO00KdRXQApLvLQGmIc:JygC_h56_WVkjaGA2AmGFdEXqI0=',
};

export default function App() {
  return (
    <div className={styles.box}>
      <Topbar title="课程详情" showBack={true} />
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
          &nbsp; 基本信息
        </div>
        <div className={styles.kv}>
          <span className={styles.key}>自闭症儿童平衡性训练</span>
          <span className={styles.tag}>
            <Tag type="primary" size="large">
              学习中
            </Tag>
          </span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>张医生</span>
          <span className={styles.v}>2021-08-09 12:33</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>张医生</span>
          <span className={styles.v}>2021-08-09 12:33</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>张医生</span>
          <span className={styles.v}>2021-08-09 12:33</span>
        </div>
      </div>
    </div>
  );
}

function Result({ data }) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={cls(styles.title, styles.nomb)}>
          <Icon name="coupon" size={18} />
          &nbsp; 训练动作（共3个）
        </div>
        <div className={styles.cardItem}>
          <img src={data?.img} alt="" />
          <div className={cls(styles.title, styles.nobt)}>平衡性训练</div>
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
    </div>
  );
}
