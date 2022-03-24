import Topbar from '@/comps/TopBar';
import { MediaType } from '@/service/const';
import request from '@/service/request';
import { PauseCircleO, PlayCircleO } from '@react-vant/icons';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './growDetail.module.less';

export default function App() {
  return (
    <div className={styles.box}>
      <Topbar title="量表详情" />
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
        url: '/scaleRecord/detail',
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
      <div className={styles.cardBox}></div>
      {data.questions?.map((v, i) => (
        <div className={styles.cardBox} key={i}>
          <div className={styles.card}>
            <div className={styles.title}>
              {i + 1}/{data?.questions?.length} &nbsp; {v.questionContent}
            </div>
            <div>
              <div className={styles.subTitle}>{v.answerContent}</div>
              <div className={styles.remark}>补充说明：{v.remark}</div>
              <div className={styles.mediaBox} style={{ borderBottom: 'none' }}>
                {v.attachments?.map((m, i) => (
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
          </div>
        </div>
      ))}
      {/* {audioSrc && <audio src={audioSrc}></audio>} */}
    </>
  );
}
