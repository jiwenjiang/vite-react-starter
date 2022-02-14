import Topbar from '@/comps/TopBar';
import Video from '@/comps/Video';
import request from '@/service/request';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Circle, Icon, Popup, Tabs } from 'react-vant';
import { cls } from 'reactutils';
import styles from './index.module.less';

const data = {
  name: 1,
  img: 'http://kfqn.fushuhealth.com/picture/2022/01/17/23c7c4262df6457bac4701b581b6b87d_wm.jpg?e=1643034341&token=5tWU4jx332LnEkvTlzONEFO00KdRXQApLvLQGmIc:JygC_h56_WVkjaGA2AmGFdEXqI0=',
};

export default function App() {
  const params = useParams();
  const [detail, setDetail] = useState({ actions: [] });

  const getDetail = async () => {
    const res = await request({
      url: '/record/get',
      data: { id: params.id },
    });
    setDetail(res.data);
  };
  useEffect(() => {
    getDetail();
  }, []);
  return (
    <div className={styles.box}>
      <Topbar title="训练报告" showBack={true} />
      <Card {...detail} />
      <Result data={detail.actions} />
    </div>
  );
}

function Card(data) {
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={styles.title}>
          <Icon name="coupon" size={18} />
          &nbsp; 医生回复
        </div>
        <div className={styles.kv}>
          <span className={styles.k}>{data.doctorName}</span>
          <span className={styles.v}>{data.time}</span>
        </div>
        <div className={styles.kv}>
          <div className={styles.k}>{data.remark}</div>
        </div>
      </div>
    </div>
  );
}

function Result({ data }) {
  const [active, setActive] = useState('');
  const [current, setCurrent] = useState({ coverUrl: '' });
  const [circleVal, setCircleVal] = useState({ rate: 0, text: '' });
  const [currentVideo, setcurrentVideo] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setActive(data[0]?.id);
  }, [data]);

  useEffect(() => {
    const item = data.find((v) => v.id === active);
    if (item) {
      setCurrent(item);
      setcurrentVideo(item.videos[0]?.url);
      const rate =
        item.finishCount / item.planCount > 1
          ? 100
          : ((item.finishCount / item.planCount) as any).toFixed(1) * 100;

      setCircleVal({ text: rate + '%', rate });
    }
  }, [active]);
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={cls(styles.title, styles.nomb)}>
          <Icon name="coupon" size={18} />
          &nbsp; 训练结果
        </div>
        <Tabs active={active}>
          {data.map((v) => (
            <Tabs.TabPane title={v.actionName} name={v.id} key={v.id}></Tabs.TabPane>
          ))}
        </Tabs>
        <img src={current?.coverUrl} alt="" onClick={() => setShowVideo(true)} />
        <div className={styles.circleBox}>
          <Circle
            rate={circleVal.rate}
            text={circleVal.text}
            strokeWidth={50}
            color={{
              '0%': '#366F9D',
              '100%': '#C33022',
            }}
          />
        </div>
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
