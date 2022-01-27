import FTabbar from '@/comps/Tabbar';
import Topbar from '@/comps/TopBar';
import Video from '@/comps/Video';
import VList from '@/comps/VList';
import React, { useEffect, useState } from 'react';
import { Badge, Icon, Popup } from 'react-vant';
import styles from './index.module.less';

const data = [
  {
    name: 1,
    img: 'http://kfqn.fushuhealth.com/picture/2022/01/17/23c7c4262df6457bac4701b581b6b87d_wm.jpg?e=1643034341&token=5tWU4jx332LnEkvTlzONEFO00KdRXQApLvLQGmIc:JygC_h56_WVkjaGA2AmGFdEXqI0=',
  },
];

export default function App() {
  const [height, setHeight] = useState(600);
  const [show, setShow] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [loadingText, setLoadingText] = useState('正在加载中');

  const onLoad = () => {
    console.log('load');
  };

  useEffect(() => {
    const h = document.body.offsetHeight - 145;
    console.log('🚀 ~ file: index.tsx ~ line 14 ~ useEffect ~ h', h);
    setHeight(h);
  }, []);

  const open = () => {
    setShow(true);
  };

  const cb = () => {
    setShowVideo(true);
  };
  return (
    <div className={styles.box}>
      <Topbar title="训练课程" />
      <div className={styles.reply} onClick={open}>
        训练回复
        <Badge content="200" max="99" />
      </div>
      <VList
        renderFn={(d) => Card(d, cb)}
        data={data}
        itemSize={371}
        height={height}
        onLoad={onLoad}
      />
      <FTabbar />
      <Popup
        visible={show}
        position="bottom"
        style={{ height: 300 }}
        onClose={() => setShow(false)}>
        <div className={styles.popBox}>
          <div className={styles.innerBox}>
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
          </div>
        </div>
      </Popup>
      <Popup visible={showVideo} onClose={() => setShowVideo(false)}>
        <Video
          sources={[
            {
              src: 'http://kfqn.fushuhealth.com/video/2022/01/12/1964cb483c154aad94e728017d5c54b2/1641957586632_ca903850aa0a4ba8bbb16f79d5aa4cb2_469295507.m3u8?pm3u8%2F0%2Fexpires%2F43200&e=1643119846&token=5tWU4jx332LnEkvTlzONEFO00KdRXQApLvLQGmIc:U7dmXCxF21qJQQ5i5UyRrDSU-nM=',
            },
          ]}></Video>
      </Popup>
    </div>
  );
}

function Card(data, cb) {
  const onCard = () => {
    cb?.();
  };
  return (
    <div className={styles.cardBox} onClick={onCard}>
      <div className={styles.card}>
        <img src={data?.img} alt="" />
        <div className={styles.title}>平衡性训练</div>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className={styles.listBox}>
      <div className={styles.listTitle}>张三医生回复了2021-12-23 15:33的平衡性训练</div>
      <div className={styles.listDesc}>2021-08-09 12:33</div>
      <Icon name="arrow" className={styles.arrow}/>
    </div>
  );
}
