import Topbar from '@/comps/TopBar';
import { MediaType } from '@/service/const';
import request from '@/service/request';
import { GetQueryString } from '@/service/utils';
import {
    Audio,
    PauseCircleO,
    Photograph,
    PlayCircleO,
    StopCircleO
} from '@react-vant/icons';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Form, Radio } from 'react-vant';
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
  const title = useRef();
  const age = useRef(1);
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

  const getList = async () => {
    const res = await request({
      url: '/scaleTable/get',
      data: { code: GetQueryString('code'), age: age.current },
    });
    const datas = res.data.subjects?.map((v) => ({
      ...v,
      questions: v.questions?.map((c) => ({ ...c, remark: '', attachments: [] })),
    }));
    title.current = res.data.name;
    setData(datas);
    setCurrentData(datas[0].questions[0]);
    console.log('🚀 ~ file: feel.tsx ~ line 51 ~ getList ~ title.current', title.current);
  };

  useEffect(() => {
    if (baseinfo) {
      getList();
    }
  }, [baseinfo]);

  const pre = () => {
    setQuestionIndex(questionIndex - 1);
    setCurrentData(data[0].questions[questionIndex - 1]);
  };

  const next = () => {
    setQuestionIndex(questionIndex + 1);
    setCurrentData(data[0].questions[questionIndex + 1]);
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
    console.log('🚀 ~ file: feel.tsx ~ line 201 ~ baseSubmit ~ params', params);
    const a = moment().diff(moment(params.birthday, 'X'), 'year');
    console.log('🚀 ~ file: feel.tsx ~ line 202 ~ baseSubmit ~ a', a);
    age.current = a;
    setBaseinfo(params);
  };

  return (
    <>
      {!baseinfo ? (
        <Baseinfo submit={baseSubmit} />
      ) : (
        <div className={styles.box}>
          <Topbar title="儿童发育里程碑评测" />
          <div className={styles.tabBox}>
            <div className={styles.title2}>{title.current}</div>
            <div className={styles.tibox}>
              <div style={{ marginBottom: 4 }}>
                {questionIndex + 1}/{data[0]?.sum}
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
                <div className={styles.title}>补充说明（非必填）</div>
                <Field
                  rows={3}
                  onChange={(e) => changeVal(e, currentData, 'remark')}
                  value={currentData?.remark ?? ''}
                  type="textarea"
                  placeholder="填写补充说明"
                />
                <div className={styles.mediaBox}>
                  {currentData?.mediaList?.map((v, i) =>
                    v.type === MediaType.PICTURE ? (
                      <img className={styles.imgs} alt="pic" key={i} src={v.localData} />
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
            {questionIndex === data[active]?.questions?.length - 1 ? (
              <>
                <Button className={styles.btn} onClick={submit} type="primary" block>
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
                {questionIndex !== 0 && (
                  <Button className={styles.btn} block onClick={pre}>
                    上一题
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
