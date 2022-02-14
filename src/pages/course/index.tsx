import FTabbar from '@/comps/Tabbar';
import Topbar from '@/comps/TopBar';
import Video from '@/comps/Video';
import VList from '@/comps/VList';
import request from '@/service/request';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popup, Tabs } from 'react-vant';
import styles from './index.module.less';

const filterNum = (v) => {
  return { 0: '周一', 1: '周二', 2: '周三', 3: '周四', 4: '周五', 5: '周六', 6: '周七' }[
    v
  ];
};

export default function App() {
  const [height, setHeight] = useState(600);
  const [showVideo, setShowVideo] = useState(false);
  const [data, setData] = useState([]);
  const total = useRef(1);
  const params = useRef({ pageNo: 1, pageSize: 10, status: '2' });
  const isLoading = useRef(false);
  const [loadingText, setLoadingText] = useState('正在加载中');
  const [currentVideo, setcurrentVideo] = useState('');
  const [active, setActive] = useState('2');
  const navigate = useNavigate();

  const onLoad = () => {
    if (total.current > params.current.pageNo && !isLoading.current) {
      isLoading.current = true;
      params.current.pageNo++;
      getList();
    }
  };

  const getList = async (init?: boolean) => {
    const res = await request({
      url: '/plan/list',
      data: params.current,
    });
    total.current = res.data?.page?.totalPage;
    if (total.current === params.current.pageNo) {
      setLoadingText('无更多数据了~');
    }
    setData(init ? res.data?.plans : [...data, ...res.data?.plans]);
    isLoading.current = false;
  };

  useEffect(() => {
    const h = document.body.offsetHeight - 145;
    setHeight(h);
    getList(true);
  }, []);

  const cb = async (data) => {
    navigate(`/courseDetail/${data.id}`);
  };

  const videoCb = async (data) => {
    const res = await request({
      url: '/plan/get',
      data: { id: data.id },
    });
    setcurrentVideo(res.data.actions[0]?.videos?.[0]?.url);
    setShowVideo(true);
  };

  const changeTab = (v) => {
    setActive(v);
    params.current.pageNo = 1;
    params.current.status = v;
    getList(true);
  };

  return (
    <div className={styles.box}>
      <Topbar title="训练课程" />
      <Tabs active={active} onChange={changeTab}>
        <Tabs.TabPane title="进行中" name="2"></Tabs.TabPane>
        <Tabs.TabPane title="未开始" name="1"></Tabs.TabPane>
        <Tabs.TabPane title="已完成" name="4"></Tabs.TabPane>
      </Tabs>
      <VList
        renderFn={(d) => Card(d, videoCb, cb)}
        data={data}
        itemSize={371}
        height={height}
        onLoad={onLoad}
        loadingText={loadingText}
      />
      <FTabbar />
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

function Card(data, videoCb, cb) {
  const onVideo = () => {
    videoCb?.(data);
  };

  const onCard = () => {
    cb?.(data);
  };
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <img src={data?.coverUrl} alt="" onClick={onVideo} />
        <div onClick={onCard}>
          <div className={styles.title}>{data.planName}</div>
          <div className={styles.kv}>
            <span className={styles.k}>训练动作</span>
            <span className={styles.v}>共{data.totalTrainedCount}个</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>训练时间</span>
            <span className={styles.v}>
              {data.startTime} 至 {data.endTime}
            </span>
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>每周训练</span>
            <span className={styles.v}>
              {data.frequency.reduce((total, num) => total + filterNum(num) + ',', '')}
            </span>
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>训练目的</span>
            <span className={styles.v}>{data.target}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
