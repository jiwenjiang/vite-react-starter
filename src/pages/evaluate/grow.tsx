import Topbar from '@/comps/TopBar';
import { MediaType } from '@/service/const';
import request from '@/service/request';
import {
  Audio,
  PauseCircleO,
  Photograph,
  PlayCircleO,
  StopCircleO
} from '@react-vant/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Form, Radio, Swiper, Tabs } from 'react-vant';
import Baseinfo from './baseinfo';
import styles from './grow.module.less';

export default function App() {
  const [data, setData] = useState([]);
  const [active, setActive] = useState(0);
  const [form] = Form.useForm();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const navigate = useNavigate();
  const [baseinfo, setBaseinfo] = useState(null);
  const age = useRef(1);

  const getList = async () => {
    const res = await request({
      url: '/scaleTable/get',
      data: { code: 7, birthday: age.current },
    });
    const datas = res.data.subjects?.map((v) => ({
      ...v,
      questions: v.questions?.map((c) => ({ ...c, remark: '', attachments: [] })),
    }));
    setData(datas);
  };

  useEffect(() => {
    if (baseinfo) {
      getList();
    }
  }, [baseinfo]);

  const changeTab = (v) => {
    setActive(v);
  };

  const pre = () => {
    if (questionIndex === 0) {
      setActive(active - 1);
      setQuestionIndex(data[active - 1].questions.length - 1);
    } else {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const next = () => {
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
      scaleTableCode: 7,
      answers,
      // answers: data[active].questions?.map((v) => ({
      //   answerSn: v.answerSn ?? 1,
      //   questionSn: v.sn,
      //   remark: v.remark,
      //   attachments: v.attachments,
      // })),
    };
    const res = await request({
      url: '/scaleRecord/save',
      data: params,
      method: 'POST',
    });
    if (res.success) {
      navigate(`/evaluate/growDetail/${res.data.id}`);
    }
  };

  const baseSubmit = (params) => {
    age.current = params.birthday;
    setBaseinfo(params);
  };

  return (
    <>
      {!baseinfo ? (
        <Baseinfo submit={baseSubmit} />
      ) : (
        <div className={styles.box}>
          <Topbar title="儿童发育里程碑评测" />
          <Tabs
            active={active}
            onChange={changeTab}
            ellipsis={false}
            animated
            swipeThreshold={3}>
            {data.map((v, i) => (
              <Tabs.TabPane title={v.subject} name={i} key={i}>
                <div className={styles.tabBox} key={i}>
                  {v.questions[questionIndex]?.carousels?.length > 0 && (
                    <Swiper autoplay={5000}>
                      {v.questions[questionIndex].carousels.map((m) => (
                        <Swiper.Item key={m}>
                          <div
                            className={styles.swiperBox}
                            style={{
                              backgroundImage: `url(${m})`,
                            }}></div>
                        </Swiper.Item>
                      ))}
                    </Swiper>
                  )}
                  <div className={styles.tibox}>
                    <div style={{ marginBottom: 4 }}>
                      {questionIndex + 1}/{data[i].sum}
                    </div>
                    <Form form={form} layout="vertical">
                      <div className={styles.title}>
                        {v.questions[questionIndex]?.name}
                      </div>
                      <Radio.Group
                        value={v.questions[questionIndex]?.answerSn ?? 1}
                        onChange={(e) =>
                          changeVal(e, v.questions[questionIndex], 'answerSn')
                        }>
                        {v.questions[questionIndex]?.answers.map((c) => (
                          <Radio name={c.sn} key={c.sn}>
                            {c.content}
                          </Radio>
                        ))}
                      </Radio.Group>
                      <div className={styles.title}>补充说明（非必填）</div>
                      <Field
                        rows={3}
                        onChange={(e) =>
                          changeVal(e, v.questions[questionIndex], 'remark')
                        }
                        value={v.questions[questionIndex]?.remark ?? ''}
                        type="textarea"
                        placeholder="填写补充说明"
                      />
                      <div className={styles.mediaBox}>
                        {v.questions[questionIndex]?.mediaList?.map((v, i) =>
                          v.type === MediaType.PICTURE ? (
                            <img
                              className={styles.imgs}
                              alt="pic"
                              key={i}
                              src={v.localData}
                            />
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
                      <Button
                        className={styles.btn}
                        onClick={submit}
                        type="primary"
                        block>
                        提交答案
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
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
      )}
    </>
  );
}
