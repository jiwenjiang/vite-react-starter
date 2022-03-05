import FTabbar from '@/comps/Tabbar';
import Topbar from '@/comps/TopBar';
import Video from '@/comps/Video';
import VList from '@/comps/VList';
import request from '@/service/request';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Icon, Popup } from 'react-vant';
import styles from './index.module.less';

export default function App() {
  const [height, setHeight] = useState(600);
  const [show, setShow] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [data, setData] = useState([]);
  const [markList, setMarkList] = useState([]);
  const total = useRef(1);
  const params = useRef({ pageNo: 1, pageSize: 10, patientId: null });
  const isLoading = useRef(false);
  const [loadingText, setLoadingText] = useState('正在加载中');
  const [currentVideo, setcurrentVideo] = useState('');
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
      url: '/record/list',
      data: params.current,
    });
    total.current = res.data?.page?.totalPage;
    if (total.current === params.current.pageNo) {
      setLoadingText('无更多数据了~');
    }
    setData(init ? res.data?.trainingRecords : [...data, ...res.data?.trainingRecords]);
    isLoading.current = false;
  };

  const getMarkList = async () => {
    const res = await request({
      url: '/remark/list',
    });
    setMarkList(res.data);
  };

  useEffect(() => {
    const h = document.body.offsetHeight - 100;
    setHeight(h);
    if (sessionStorage.user) {
      const user = JSON.parse(sessionStorage.user);
      params.current.patientId = user.id;
      getList(true);
      getMarkList();
    }
  }, []);

  const open = () => {
    setShow(true);
  };

  const cb = async (data) => {
    const res = await request({
      url: '/record/get',
      data: { id: data.id },
    });
    setcurrentVideo(res.data.actions[0]?.videos?.[0]?.url);
    setShowVideo(true);
  };

  const choose = async (v) => {
    await request({
      url: '/remark/read',
      data: { id: v.id },
    });
    navigate(`/report/${v.recordId}`);
  };

  const toReport = async (v) => {
    navigate(`/report/${v.id}`);
  };
  return (
    <div className={styles.box}>
      <Topbar title="训练记录" />
      <div className={styles.reply} onClick={open}>
        训练回复
        <Badge content={markList.length} max="99" />
      </div>
      <VList
        renderFn={(d) => Card(d, cb, toReport)}
        data={data}
        itemSize={255}
        height={height}
        onLoad={onLoad}
        loadingText={loadingText}
      />
      <FTabbar />
      <Popup
        visible={show}
        position="bottom"
        style={{ height: 300 }}
        onClose={() => setShow(false)}>
        <div className={styles.popBox}>
          <div className={styles.innerBox}>
            {markList.map((v, i) => (
              <Fragment key={i}>
                <div onClick={() => choose(v)}>
                  <Link to={`/report/${v.recordId}`}>
                    <ListItem {...v} />
                  </Link>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </Popup>
      <Popup visible={showVideo} destroyOnClose={true} onClose={() => setShowVideo(false)}>
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

function Card(data, cb, choose) {
  const onCard = () => {
    cb?.(data);
  };

  const chooseFn = async () => {
    choose?.(data);
  };
  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <img src={data?.coverUrl} alt="" onClick={onCard} />
        <div className={styles.title} onClick={chooseFn}>
          <span>{data.planName}</span>
          <span className={styles.trainingTime}>{data.trainingTime}</span>
        </div>
      </div>
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
