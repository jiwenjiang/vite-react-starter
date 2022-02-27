import Topbar from '@/comps/TopBar';
import Video from '@/comps/Video';
import request from '@/service/request';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon, Popup, Tag } from 'react-vant';
import { cls } from 'reactutils';
import styles from './index.module.less';

const filterNum = (v) => {
  return { 0: '周一', 1: '周二', 2: '周三', 3: '周四', 4: '周五', 5: '周六', 6: '周七' }[
    v
  ];
};

export default function App() {
  const [data, setData] = useState({ actions: [] });
  const params = useParams();

  useEffect(() => {
    (async () => {
      const res = await request({
        url: '/plan/get',
        data: { id: params.id },
      });
      setData(res.data);
    })();
  }, []);

  return (
    <div className={styles.box}>
      <Topbar title="课程详情" showBack={true} />
      <Card data={data} />
      <Result data={data.actions} />
    </div>
  );
}

function Card({ data }) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={styles.title}>
          <Icon name="coupon" size={18} />
          &nbsp; 基本信息
        </div>
        <div className={styles.kv}>
          <span className={styles.key}>{data.planName}</span>
          <span className={styles.tag}>
            <Tag type="primary" size="large">
              {data.trainingStatus}
            </Tag>
          </span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>训练动作</span>
          <span className={styles.v}>共{data.planActionCount}个</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>训练时间</span>
          <span className={styles.v}>{data.totalTrainedTime}</span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>每周训练</span>
          <span className={styles.v}>
            {data.frequency?.reduce((total, num) => total + filterNum(num) + ',', '')}
          </span>
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>训练目的</span>
          <span className={styles.v}>{data.target}</span>
        </div>
      </div>
    </div>
  );
}

function Result({ data }) {
  const [currentVideo, setcurrentVideo] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  const choose = async (v) => {
    setcurrentVideo(v.videos?.[0]?.url);
    setShowVideo(true);
  };

  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={cls(styles.title, styles.nomb)}>
          <Icon name="coupon" size={18} />
          &nbsp; 训练动作（共{data.length}个）
        </div>
        {data.map((v, i) => (
          <div className={styles.cardItem} key={i}>
            <img src={v?.actionCoverUrl} alt="" onClick={() => choose(v)} />
            <div className={cls(styles.title, styles.nobt)}>{v.actionName}</div>
            <div className={styles.kv}>
              <span className={styles.k}>单次持续时间</span>
              <span className={styles.v}>{v.everyDuration}</span>
            </div>
            <div className={styles.kv}>
              <span className={styles.k}>训练次数</span>
              <span className={styles.v}>{v.cycles}</span>
            </div>
            <div className={styles.kv}>
              <span className={styles.k}>休息时间</span>
              <span className={styles.v}>{v.restTime}</span>
            </div>
          </div>
        ))}
      </div>
      <Popup visible={showVideo} onClose={() => setShowVideo(false)}>
        <Video
          sources={[
            {
              src: currentVideo,
            },
          ]}></Video>
      </Popup>
    </div>
  );
}
