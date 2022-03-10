import Topbar from '@/comps/TopBar';
import request from '@/service/request';
import React, { useEffect, useState } from 'react';
import { Button, Field, Form, Radio, Swiper, Tabs } from 'react-vant';
import styles from './grow.module.less';

export default function App() {
  const [data, setData] = useState([]);
  const [active, setActive] = useState(0);
  const [form] = Form.useForm();
  const [questionIndex, setQuestionIndex] = useState(0);

  const getList = async (init?: boolean) => {
    const res = await request({
      url: '/scaleTable/get',
      data: { code: 7 },
    });
    setData(res.data.subjects);
  };

  useEffect(() => {
    getList();
  }, []);

  const changeTab = (v) => {
    setActive(v);
  };

  const pre = () => {
    setQuestionIndex(questionIndex - 1);
  };

  const next = () => {
    setQuestionIndex(questionIndex + 1);
  };

  const changeRadio = (e, q) => {
    q.val = e;
    setData([...data]);
  };

  return (
    <>
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
                      {v.questions[questionIndex]?.name}/{v.questions[questionIndex]?.val}
                    </div>
                    <Radio.Group
                      value={v.questions[questionIndex]?.val || 1}
                      onChange={(e) => changeRadio(e, v.questions[questionIndex])}>
                      {v.questions[questionIndex]?.answers.map((c) => (
                        <Radio name={c.sn} key={c.sn}>
                          {c.content}
                        </Radio>
                      ))}
                    </Radio.Group>
                    <div className={styles.title}>补充说明（非必填）</div>
                    <Field rows={3} autosize type="textarea" placeholder="填写补充说明" />
                  </Form>
                </div>
              </div>
            </Tabs.TabPane>
          ))}
        </Tabs>
        <div className={styles.btnbox}>
          {questionIndex === data[active]?.questions?.length - 1 ? (
            <>
              <Button className={styles.btn} type="primary" block>
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
    </>
  );
}
