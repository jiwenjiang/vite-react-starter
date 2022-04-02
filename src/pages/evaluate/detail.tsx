import Topbar from '@/comps/TopBar';
import Video from '@/comps/Video';
import { MediaType } from '@/service/const';
import request from '@/service/request';
import { PauseCircleO, PlayCircle, PlayCircleO } from '@react-vant/icons';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Popup } from 'react-vant';
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
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(false);

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

  const playVideo = (v) => {
    console.log('🚀 ~ file: grow.tsx ~ line 234 ~ playVideo ~ v', v);
    setCurrentVideo(v);
    setShowVideo(true);
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
                    ) : m.type === MediaType.VIDEO ? (
                      <div
                        className={styles.iconBox}
                        key={i}
                        onClick={() => playVideo(m.url)}>
                        <PlayCircle />
                      </div>
                    ) : (
                      <div className={styles.iconBox} key={i}>
                        {isPlay ? (
                          <PauseCircleO onClick={() => stopVoice()} />
                        ) : (
                          <PlayCircleO onClick={() => startVoice(m.url)} />
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
      <Popup
        visible={showVideo}
        destroyOnClose={true}
        onClose={() => setShowVideo(false)}>
        <Video
          sources={[
            {
              src: currentVideo,
            },
          ]}></Video>
      </Popup>
      {/* {audioSrc && <audio src={audioSrc}></audio>} */}
    </>
  );
}
