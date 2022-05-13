import Recorder from '@/comps/Recorder';
import Topbar from '@/comps/TopBar';
import VideoComp from '@/comps/Video';
import { MediaType } from '@/service/const';
import request from '@/service/request';
import {
  Audio,
  PauseCircleO,
  Photograph,
  PlayCircle,
  PlayCircleO,
  StopCircleO,
  Video
} from '@react-vant/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Form, Notify, Popup, Radio, Swiper } from 'react-vant';
import Baseinfo from './baseinfo';
import styles from './grow.module.less';

export default function App() {
  const [data, setData] = useState([]);
  const [active, setActive] = useState(0);
  const [form] = Form.useForm();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const navigate = useNavigate();
  const [baseinfo, setBaseinfo] = useState(null);
  const age = useRef(1);
  const [btnText, setBtnText] = useState('提交答案');
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(false);

  const getList = async () => {
    const res = await request({
      url: '/scaleTable/get',
      data: { code: 9, birthday: age.current },
    });
    const datas = res.data.subjects?.map((v) => ({
      ...v,
      questions: v.questions?.map((c) => ({
        ...c,
        remark: '',
        attachments: [],
        mediaList: [],
        answerSn: 1,
      })),
    }));
    setData(datas);
  };

  useEffect(() => {
    if (baseinfo) {
      getList();
    }
  }, [baseinfo]);

  const pre = () => {
    if (questionIndex === 0) {
      setActive(active - 1);
      setQuestionIndex(data[active - 1].questions.length - 1);
    } else {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const next = () => {
    if (
      data[active].questions[questionIndex]?.attachments?.length === 0 &&
      data[active].questions[questionIndex]?.answerSn !== 1
    ) {
      Notify.show({ type: 'warning', message: '请至少上传一个视频或图片' });
      return;
    }
    if (questionIndex < data[active].questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setActive(active + 1);
      setQuestionIndex(0);
    }
  };

  const changeVal = (e, q, m) => {
    q[m] = e;
    setData([...data]);
  };

  const chooseImg = (type: MediaType) => {
    window.wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        window.wx.uploadImage({
          localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res2) {
            var serverId = res2.serverId; // 返回图片的服务器端ID
            window.wx.getLocalImgData({
              localId: res.localIds[0], // 图片的localID
              success: function (res) {
                var localData = res.localData; // localData是图片的base64数据，可以用img标签显示

                if (data[active].questions[questionIndex].mediaList) {
                  data[active].questions[questionIndex].mediaList.push({
                    type,
                    localData,
                  });
                } else {
                  data[active].questions[questionIndex].mediaList = [
                    {
                      type,
                      localData,
                    },
                  ];
                }

                data[active].questions[questionIndex].attachments.push({
                  type,
                  serverId,
                });
                setData([...data]);
              },
            });
          },
        });
      },
    });
  };

  const startRecord = () => {
    setIsRecord(true);
    window.wx.startRecord();
  };

  const stopRecord = () => {
    setIsRecord(false);
    const type = MediaType.AUDIO;
    window.wx.stopRecord({
      success: function (res) {
        var localData = res.localId;
        window.wx.uploadVoice({
          localId: localData, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res2) {
            var serverId = res2.serverId; // 返回音频的服务器端ID
            if (data[active].questions[questionIndex].mediaList) {
              data[active].questions[questionIndex].mediaList.push({
                type,
                localData,
              });
            } else {
              data[active].questions[questionIndex].mediaList = [
                {
                  type,
                  localData,
                },
              ];
            }
            data[active].questions[questionIndex].attachments.push({
              type,
              serverId,
            });
            setData([...data]);
          },
        });
      },
    });
  };

  const startVoice = (localId) => {
    setIsPlay(true);
    window.wx.playVoice({
      localId, // 需要播放的音频的本地ID，由stopRecord接口获得
    });
  };

  const stopVoice = (localId) => {
    setIsPlay(false);
    window.wx.stopVoice({
      localId, // 需要停止的音频的本地ID，由stopRecord接口获得
    });
  };

  const submit = async () => {
    if (
      data[active].questions[questionIndex]?.attachments?.length === 0 &&
      data[active].questions[questionIndex]?.answerSn !== 1
    ) {
      Notify.show({ type: 'warning', message: '请至少上传一个视频或图片' });
      return;
    }
    const answers = [];
    data.forEach((c) => {
      c.questions.forEach((v) => {
        answers.push({
          answerSn: v.answerSn ?? 1,
          questionSn: v.sn,
          remark: v.remark,
          attachments: v.attachments,
        });
      });
    });

    const params = {
      ...(baseinfo as object),
      scaleTableCode: 9,
      answers,
      // answers: data[active].questions?.map((v) => ({
      //   answerSn: v.answerSn ?? 1,
      //   questionSn: v.sn,
      //   remark: v.remark,
      //   attachments: v.attachments,
      // })),
    };
    if (btnText === '计算中') return;
    setBtnText('计算中');
    const res = await request({
      url: '/scaleRecord/save',
      data: params,
      method: 'POST',
    });
    if (res.success) {
      setBtnText('提交答案');
      navigate(`/evaluate/brainDetail/${res.data.id}`);
    }
  };

  const baseSubmit = (params) => {
    age.current = params.birthday;
    setBaseinfo(params);
  };

  const upload = (params, file) => {
    console.log('🚀 ~ file: grow.tsx ~ line 222 ~ upload ~ file', file);
    data[active].questions[questionIndex].mediaList.push({
      type: MediaType.VIDEO,
      localData: file,
    });
    data[active].questions[questionIndex].attachments.push({
      type: MediaType.VIDEO,
      ...params,
    });
    setData([...data]);
  };

  const playVideo = (v) => {
    console.log('🚀 ~ file: grow.tsx ~ line 234 ~ playVideo ~ v', v);
    setCurrentVideo(v);
    setShowVideo(true);
  };

  return (
    <>
      {!baseinfo ? (
        <Baseinfo submit={baseSubmit} code="9" />
      ) : (
        <div className={styles.box}>
          <Topbar title="脑瘫量表" />
          {data[active] && (
            <div>
              <div className={styles.tabBox}>
                <div className={styles.subject}>{data[active]?.subject}</div>

                {data[active]?.questions[questionIndex]?.carousels?.length > 0 && (
                  <Swiper autoplay={false}>
                    {data[active].questions[questionIndex].carousels.map((m) => (
                      <Swiper.Item key={m}>
                        {m.includes('mp4') ? (
                          <video
                            src={m}
                            autoPlay
                            muted
                            style={{ width: 320, height: 143 }}></video>
                        ) : (
                          <div
                            className={styles.swiperBox}
                            style={{
                              backgroundImage: `url(${m})`,
                            }}></div>
                        )}
                      </Swiper.Item>
                    ))}
                  </Swiper>
                )}
                <div className={styles.tibox}>
                  <div style={{ marginBottom: 8 }}>
                    {questionIndex + 1}/{data[active].sum}
                  </div>
                  <Form form={form} layout="vertical">
                    <div className={styles.title}>
                      {data[active].questions[questionIndex]?.name}
                    </div>
                    <Radio.Group
                      value={data[active].questions[questionIndex]?.answerSn ?? 1}
                      onChange={(e) =>
                        changeVal(e, data[active].questions[questionIndex], 'answerSn')
                      }>
                      {data[active].questions[questionIndex]?.answers.map((c) => (
                        <Radio name={c.sn} key={c.sn}>
                          {c.content}
                        </Radio>
                      ))}
                    </Radio.Group>
                    <div className={styles.title}>补充说明（非必填）</div>
                    <Field
                      rows={3}
                      onChange={(e) =>
                        changeVal(e, data[active].questions[questionIndex], 'remark')
                      }
                      value={data[active].questions[questionIndex]?.remark ?? ''}
                      type="textarea"
                      placeholder="填写补充说明"
                    />
                    <div className={styles.mediaBox}>
                      {data[active].questions[questionIndex]?.mediaList?.map((v, i) =>
                        v.type === MediaType.PICTURE ? (
                          <img
                            className={styles.imgs}
                            alt="pic"
                            key={i}
                            src={v.localData}
                          />
                        ) : v.type === MediaType.VIDEO ? (
                          <div
                            className={styles.iconBox}
                            key={i}
                            onClick={() => playVideo(v.localData)}>
                            <PlayCircle />
                          </div>
                        ) : (
                          <div className={styles.iconBox} key={i}>
                            {isPlay ? (
                              <PauseCircleO onClick={() => stopVoice(v.localData)} />
                            ) : (
                              <PlayCircleO onClick={() => startVoice(v.localData)} />
                            )}
                          </div>
                        ),
                      )}
                      <div
                        className={styles.iconBox}
                        onClick={() => chooseImg(MediaType.PICTURE)}>
                        <Photograph />
                      </div>
                      <div
                        className={styles.iconBox}
                        onClick={() => {
                          setOpenVideo(true);
                        }}>
                        <Video />
                      </div>
                      <div
                        className={styles.iconBox}
                        onClick={() => {
                          isRecord ? stopRecord() : startRecord();
                        }}>
                        {isRecord ? <StopCircleO /> : <Audio />}
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
              <div className={styles.btnbox}>
                {active === data.length - 1 &&
                questionIndex === data[active]?.questions?.length - 1 ? (
                  <>
                    <Button className={styles.btn} onClick={submit} type="primary" block>
                      {btnText}
                    </Button>
                    {data[active]?.questions?.length > 1 && (
                      <Button className={styles.btn} block onClick={pre}>
                        上一题
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button className={styles.btn} type="primary" block onClick={next}>
                      下一题
                    </Button>
                    {(active !== 0 || questionIndex !== 0) && (
                      <Button className={styles.btn} block onClick={pre}>
                        上一题
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* <Tabs
            active={active}
            onChange={changeTab}
            ellipsis={false}
            animated
            swipeable={false}
            swipeThreshold={3}>
            {data.map((v, i) => (
              <Tabs.TabPane title={v.subject} name={i} key={i}></Tabs.TabPane>
            ))}
          </Tabs> */}
        </div>
      )}
      <Popup
        visible={showVideo}
        destroyOnClose={true}
        onClose={() => setShowVideo(false)}>
        <VideoComp
          sources={[
            {
              src: currentVideo,
            },
          ]}></VideoComp>
      </Popup>
      {openVideo && <Recorder close={() => setOpenVideo(false)} uploadCb={upload} />}
    </>
  );
}
