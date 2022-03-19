import Topbar from '@/comps/TopBar';
import { MediaType } from '@/service/const';
import request from '@/service/request';
import { PauseCircleO, PlayCircleO } from '@react-vant/icons';
import React, { Fragment, useEffect, useState } from 'react';
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
            &nbsp; 基本信息
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>昵称</span>
            <span className={styles.v}>{data.name}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>性别</span>
            <span className={styles.v}>{data.gender}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>年龄段</span>
            <span className={styles.v}>{data.age}</span>
          </div>
        </div>
      </div>
      {data.types?.map((v, i) => (
        <div className={styles.cardBox} key={i}>
          <div className={styles.card}>
            <div className={styles.title}>
              <Icon name="coupon" size={18} />
              &nbsp; {v.type}
            </div>
            {v.results?.map((c, i) => (
              <div key={i}>
                <div className={styles.subTitle}>
                  {i + 1}.{c.question}
                </div>
                <div className={styles.remark}>补充说明：{c.remark}</div>
                <div className={styles.mediaBox}>
                  {c.attachments?.map((m, i) => (
                    <Fragment key={i}>
                      {m.type === MediaType.PICTURE ? (
                        <img className={styles.imgs} alt="pic" key={i} src={m.url} />
                      ) : (
                        <div className={styles.iconBox} key={i}>
                          {isPlay ? (
                            <PauseCircleO onClick={() => stopVoice()} />
                          ) : (
                            <PlayCircleO onClick={() => startVoice(v.localData)} />
                          )}
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* {audioSrc && <audio src={audioSrc}></audio>} */}
    </>
  );
}
