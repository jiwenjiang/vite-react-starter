import Recorder from '@/comps/Recorder';
import Topbar from '@/comps/TopBar';
import VideoComp from '@/comps/Video';
import { MediaType } from '@/service/const';
import request from '@/service/request';
import { GetQueryString } from '@/service/utils';
import luxiang from '@/static/imgs/luxiang.png';
import {
  Audio,
  PauseCircleO,
  Photograph, PlayCircleO,
  StopCircleO,
  Video
} from '@react-vant/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Form, Popup, Radio } from 'react-vant';
import { cls } from 'reactutils';
import Baseinfo from './baseinfo';
import styles from './grow.module.less';

export default function App() {
  const [data, setData] = useState([]);
  const [active] = useState(0);
  const [form] = Form.useForm();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const navigate = useNavigate();
  const [baseinfo, setBaseinfo] = useState();
  const [title, setTitle] = useState('');
  const [sum, setSum] = useState(0);
  const age = useRef(1);
  const [openVideo, setOpenVideo] = useState(false);
  const [currentData, setCurrentData] = useState<
    Partial<{
      name: string;
      answers: any[];
      type: number;
      answerSn: number;
      remark: string;
      mediaList: any[];
    }>
  >({});
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(false);

  const getList = async () => {
    const res = await request({
      url: '/scaleTable/get',
      data: { code: GetQueryString('code'), birthday: age.current },
    });
    const datas = res.data.subjects?.map((v) => ({
      ...v,
      questions: v.questions?.map((c) => ({
        ...c,
        remark: '',
        attachments: [],
        mediaList: [],
      })),
    }));
    setTitle(res.data.name);
    const list = [];
    let num = 0;
    datas.forEach((v) => {
      list.push(...v.questions);
      num += v.sum;
    });
    datas[0].questions = list;
    setSum(num);
    setData(datas);
    setCurrentData(datas[0].questions[0]);
  };

  useEffect(() => {
    if (baseinfo) {
      getList();
    }
  }, [baseinfo]);

  const pre = () => {
    setQuestionIndex(questionIndex - 1);
    setCurrentData(data[active].questions[questionIndex - 1]);
  };

  const next = () => {
    setQuestionIndex(questionIndex + 1);
    setCurrentData(data[active].questions[questionIndex + 1]);
  };

  const changeVal = (e, q, m) => {
    q[m] = e;
    setData([...data]);
  };

  const chooseImg = (type: MediaType) => {
    window.wx.chooseImage({
      count: 1, // ??????9
      sizeType: ['original', 'compressed'], // ?????????????????????????????????????????????????????????
      sourceType: ['album', 'camera'], // ????????????????????????????????????????????????????????????
      success: function (res) {
        window.wx.uploadImage({
          localId: res.localIds[0], // ??????????????????????????????ID??????chooseImage????????????
          isShowProgressTips: 1, // ?????????1?????????????????????
          success: function (res2) {
            var serverId = res2.serverId; // ???????????????????????????ID
            window.wx.getLocalImgData({
              localId: res.localIds[0], // ?????????localID
              success: function (res) {
                var localData = res.localData; // localData????????????base64??????????????????img????????????

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
          localId: localData, // ??????????????????????????????ID??????stopRecord????????????
          isShowProgressTips: 1, // ?????????1?????????????????????
          success: function (res2) {
            var serverId = res2.serverId; // ???????????????????????????ID
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
      localId, // ??????????????????????????????ID??????stopRecord????????????
    });
  };

  const stopVoice = (localId) => {
    setIsPlay(false);
    window.wx.stopVoice({
      localId, // ??????????????????????????????ID??????stopRecord????????????
    });
  };

  const submit = async () => {
    const params = {
      ...(baseinfo as object),
      scaleTableCode: GetQueryString('code'),
      answers: data[active].questions?.map((v) => ({
        answerSn: v.answerSn ?? 1,
        questionSn: v.sn,
        remark: v.remark,
        attachments: v.attachments,
      })),
    };
    const res = await request({
      url: '/scaleRecord/save',
      data: params,
      method: 'POST',
    });
    if (res.success) {
      if (['1', '2', '3', '4'].includes(GetQueryString('code'))) {
        navigate(`/evaluate/zibizheng/${res.data.id}`);
      }
      if (['6'].includes(GetQueryString('code'))) {
        navigate(`/evaluate/feelDetail/${res.data.id}`);
      }
    }
  };

  const baseSubmit = (params) => {
    // const a = moment().diff(moment(params.birthday, 'X'), 'year');
    // age.current = a;
    age.current = params.birthday;
    setBaseinfo(params);
  };

  const upload = (params, file) => {
    data[active].questions[questionIndex].mediaList.push({
      type: MediaType.VIDEO,
      localData: file.url,
      coverUrl: file.coverUrl,
    });
    data[active].questions[questionIndex].attachments.push({
      type: MediaType.VIDEO,
      ...params,
    });
    setData([...data]);
  };

  const playVideo = (v) => {
    console.log('???? ~ file: grow.tsx ~ line 234 ~ playVideo ~ v', v);
    setCurrentVideo(v);
    setShowVideo(true);
  };

  return (
    <>
      {!baseinfo ? (
        <Baseinfo submit={baseSubmit} code={GetQueryString('code')} />
      ) : (
        <div className={styles.box}>
          <Topbar title={title} />
          <div className={styles.tabBox}>
            {/* <div className={styles.title2}>{title}</div> */}
            <div className={styles.tibox}>
              <div style={{ marginBottom: 4 }}>
                {questionIndex + 1}/{sum}
              </div>
              <Form form={form} layout="vertical">
                <div className={styles.title}>{currentData?.name}</div>
                <Radio.Group
                  value={currentData?.answerSn ?? 1}
                  onChange={(e) => changeVal(e, currentData, 'answerSn')}>
                  {currentData?.answers?.map((c) => (
                    <Radio name={c.sn} key={c.sn}>
                      {c.content}
                    </Radio>
                  ))}
                </Radio.Group>
                <div className={styles.title}>???????????????????????????</div>
                <Field
                  rows={3}
                  onChange={(e) => changeVal(e, currentData, 'remark')}
                  value={currentData?.remark ?? ''}
                  type="textarea"
                  placeholder="??????????????????"
                />
                <div className={styles.mediaBox}>
                  {currentData?.mediaList?.map((v, i) =>
                    v.type === MediaType.PICTURE ? (
                      <img className={styles.imgs} alt="pic" key={i} src={v.localData} />
                    ) : v.type === MediaType.VIDEO ? (
                      <div
                        className={cls(styles.iconBox, styles.videoBox)}
                        style={{ backgroundImage: `url(${v.coverUrl})` }}
                        key={i}
                        onClick={() => playVideo(v.localData)}>
                        <img src={luxiang} alt="" />
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
            {questionIndex === data[active]?.questions?.length - 1 ? (
              <>
                <Button className={styles.btn} onClick={submit} type="primary" block>
                  ????????????
                </Button>
                {data[active]?.questions?.length > 1 && (
                  <Button className={styles.btn} block onClick={pre}>
                    ?????????
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button className={styles.btn} type="primary" block onClick={next}>
                  ?????????
                </Button>
                {questionIndex !== 0 && (
                  <Button className={styles.btn} block onClick={pre}>
                    ?????????
                  </Button>
                )}
              </>
            )}
          </div>
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
