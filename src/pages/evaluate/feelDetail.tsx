import Topbar from '@/comps/TopBar';
import request from '@/service/request';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from 'react-vant';
import styles from './growDetail.module.less';

export default function App() {
  return (
    <div className={styles.box}>
      <Topbar title="儿童发育里程碑评定结果" />
      <Card />
    </div>
  );
}

function Card() {
  const [data, setData] = useState<any>({});
  const params = useParams();
  const [isPlay, setIsPlay] = useState(false);
  const [audioSrc, setAudioSrc] = useState();

  useEffect(() => {
    (async () => {
      const res = await request({
        url: '/scaleRecord/get',
        data: { id: params.id },
      });
      setData(res.data);
    })();
  }, []);

  const startVoice = (localId) => {
    // setAudioSrc(localId);
    var mp3 = new Audio(localId);
    mp3.play();
    setIsPlay(true);
  };

  const stopVoice = () => {
    setAudioSrc(null);
    setIsPlay(false);
  };

  return (
    <>
      <div className={styles.cardBox}>
        <div className={styles.card}>
          <div className={styles.title}>
            <Icon name="coupon" size={18} />
            &nbsp; 用户详情
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>姓名</span>
            <span className={styles.v}>{data.name}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>性别</span>
            <span className={styles.v}>{data.gender}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>年龄</span>
            <span className={styles.v}>{data.age}</span>
          </div>
        </div>
      </div>
     
    </>
  );
}
